import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

type SindarinMode = 'interpret' | 'walk' | 'update' | 'manual';

const WEBSITE_URL = 'https://marketplace.visualstudio.com/items?itemName=sindarincorp.sindarin-lang';

let outputChannel: vscode.OutputChannel;

function getOutputChannel(): vscode.OutputChannel {
	if (!outputChannel) {
		outputChannel = vscode.window.createOutputChannel('Sindarin');
	}
	return outputChannel;
}

export function activate(context: vscode.ExtensionContext): void {
	getOutputChannel().appendLine('Sindarin extension activated.');

	const modes: SindarinMode[] = ['interpret', 'walk', 'update', 'manual'];
	for (const mode of modes) {
		context.subscriptions.push(
			vscode.commands.registerCommand(`sindarin-lang.${mode}`, () => runSindarin(mode)),
		);
	}
}

export function deactivate(): void {
	/* nothing to clean up */
}

/**
 * Describes how to launch the Sindarin program on the current platform.
 * `command` + `prefixArgs` are passed to a shell task; `folder` (when known)
 * is the directory that contains the Sindarin installation.
 */
interface SindarinLauncher {
	command: string;
	prefixArgs: string[];
	folder: string | undefined;
}

function defaultSindarinFolder(): string {
	return process.platform === 'win32'
		? 'C:\\Sindarin'
		: path.join(os.homedir(), 'Sindarin');
}

function executableName(): string {
	return process.platform === 'win32' ? 'Sindarin.exe' : 'Sindarin';
}

/** Looks up an executable on PATH without running it. */
function findOnPath(name: string): string | undefined {
	const pathEnv = process.env.PATH ?? '';
	const exts = process.platform === 'win32'
		? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';')
		: [''];
	for (const dir of pathEnv.split(path.delimiter)) {
		if (!dir) {
			continue;
		}
		for (const ext of exts) {
			const candidate = path.join(dir, name + ext);
			if (fs.existsSync(candidate)) {
				return candidate;
			}
		}
	}
	return undefined;
}

/**
 * Resolves how Sindarin should be invoked, in priority order:
 *   1. the `sindarin.executablePath` setting, if it points to an existing file;
 *   2. `Sindarin` available on the system PATH;
 *   3. the default install folder (C:\Sindarin or ~/Sindarin).
 * Returns `undefined` when no installation can be located.
 */
function resolveSindarin(): SindarinLauncher | undefined {
	const isMac = process.platform === 'darwin';
	const configured = vscode.workspace
		.getConfiguration('sindarin')
		.get<string>('executablePath', '')
		.trim();

	if (configured) {
		const resolved = configured.startsWith('~')
			? path.join(os.homedir(), configured.slice(1))
			: configured;
		if (fs.existsSync(resolved)) {
			return makeLauncher(resolved, isMac);
		}
		getOutputChannel().appendLine(`Configured Sindarin path does not exist: ${resolved}`);
	}

	const onPath = findOnPath(executableName());
	if (onPath) {
		return makeLauncher(onPath, isMac);
	}

	const folder = defaultSindarinFolder();
	const exe = path.join(folder, isMac ? 'Sindarin.dll' : executableName());
	if (fs.existsSync(exe)) {
		return makeLauncher(exe, isMac);
	}

	return undefined;
}

function makeLauncher(executable: string, isMac: boolean): SindarinLauncher {
	const folder = path.dirname(executable);
	if (isMac && executable.toLowerCase().endsWith('.dll')) {
		return { command: 'dotnet', prefixArgs: [executable], folder };
	}
	return { command: executable, prefixArgs: [], folder };
}

function showNotFound(): void {
	const goToWebsite = 'Go to website';
	vscode.window
		.showErrorMessage(
			`Sindarin was not found. Install it (default folder: ${defaultSindarinFolder()}) ` +
				'or set "sindarin.executablePath" in your settings.',
			goToWebsite,
		)
		.then(selection => {
			if (selection === goToWebsite) {
				vscode.env.openExternal(vscode.Uri.parse(WEBSITE_URL));
			}
		});
}

/** Ensures there is a saved `.sin` document and returns its path. */
async function resolveActiveSinFile(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('Open a Sindarin (.sin) file first.');
		return undefined;
	}

	const doc = editor.document;
	if (doc.isUntitled) {
		vscode.window.showErrorMessage('Save the document with a .sin extension before running Sindarin.');
		return undefined;
	}

	if (doc.languageId !== 'sindarin' && path.extname(doc.fileName).toLowerCase() !== '.sin') {
		vscode.window.showErrorMessage('The active file is not a Sindarin (.sin) file.');
		return undefined;
	}

	if (doc.isDirty && !(await doc.save())) {
		vscode.window.showErrorMessage('Could not save the document. Aborting.');
		return undefined;
	}

	return doc.uri.fsPath;
}

function buildArgs(mode: SindarinMode, fileName: string | undefined): string[] {
	switch (mode) {
		case 'interpret':
		case 'walk':
			return [fileName as string, `--${mode}`, '--all', '--code'];
		case 'update':
			return ['--update', '--code'];
		case 'manual':
			return ['--manual'];
	}
}

/**
 * On Linux/macOS an update may require running the bundled installer instead
 * of Sindarin's own `--update`. The installer is needed only when Sindarin
 * left a `needtoUpdate.txt` marker in its install folder.
 */
function installerOverride(
	launcher: SindarinLauncher,
): { command: string; args: string[] } | undefined {
	if (process.platform === 'win32' || !launcher.folder) {
		return undefined;
	}
	const marker = path.join(launcher.folder, 'needtoUpdate.txt');
	if (!fs.existsSync(marker)) {
		return undefined;
	}

	const isMac = process.platform === 'darwin';
	const installer = path.join(
		launcher.folder,
		'sindarininstaller',
		isMac ? 'SindarinInstaller.dll' : 'SindarinInstaller',
	);
	if (!fs.existsSync(installer)) {
		return undefined;
	}

	return isMac
		? { command: 'dotnet', args: [installer, launcher.folder] }
		: { command: installer, args: [launcher.folder] };
}

async function runSindarin(mode: SindarinMode): Promise<void> {
	const launcher = resolveSindarin();
	if (!launcher) {
		showNotFound();
		return;
	}

	let cwd: string | undefined;
	let fileName: string | undefined;
	if (mode === 'interpret' || mode === 'walk') {
		const file = await resolveActiveSinFile();
		if (!file) {
			return;
		}
		fileName = path.basename(file);
		cwd = path.dirname(file);
	}

	let command = launcher.command;
	let args = [...launcher.prefixArgs, ...buildArgs(mode, fileName)];

	if (mode === 'update') {
		const override = installerOverride(launcher);
		if (override) {
			command = override.command;
			args = override.args;
		}
	}

	const execution = new vscode.ShellExecution(command, args, cwd ? { cwd } : {});
	const task = new vscode.Task(
		{ type: 'sindarin', mode },
		vscode.TaskScope.Workspace,
		`Sindarin ${mode}`,
		'sindarin',
		execution,
	);

	try {
		await vscode.tasks.executeTask(task);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		getOutputChannel().appendLine(`Failed to run Sindarin ${mode}: ${message}`);
		vscode.window.showErrorMessage(`Failed to run Sindarin ${mode}: ${message}`);
	}
}
