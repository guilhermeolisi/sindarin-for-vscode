import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';

type SindarinMode = 'interpret' | 'walk' | 'update' | 'manual';

const WEBSITE_URL = 'https://marketplace.visualstudio.com/items?itemName=sindarincorp.sindarin-lang';

/** Official Microsoft script for installing the .NET runtime without sudo. */
const DOTNET_INSTALL_SCRIPT_URL = 'https://dot.net/v1/dotnet-install.sh';

/**
 * Known dotnet CLI locations on macOS.
 * VS Code opened from the Dock does not inherit the full shell PATH, so the
 * system-level PATH search misses dotnet even when it is installed.
 * Listed in order of preference (most common first).
 */
const DOTNET_KNOWN_PATHS_MACOS = [
	'/usr/local/bin/dotnet',                          // Intel, official installer symlink
	'/opt/homebrew/bin/dotnet',                       // Apple Silicon, Homebrew
	path.join(os.homedir(), '.dotnet', 'dotnet'),    // dotnet-install.sh default (~/.dotnet)
	'/usr/local/share/dotnet/dotnet',                 // Intel, official installer direct
];

/** Cache: once the runtime is confirmed for this VS Code session, skip re-checking. */
let macOsRuntimeVerified = false;

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
 * Finds the dotnet CLI executable.
 * Checks the system PATH first; on macOS, also checks known installation
 * paths for when VS Code is opened from the Dock (no full shell PATH).
 */
function findDotnet(): string | undefined {
	const onPath = findOnPath('dotnet');
	if (onPath) {
		return onPath;
	}
	if (process.platform === 'darwin') {
		for (const p of DOTNET_KNOWN_PATHS_MACOS) {
			if (fs.existsSync(p)) {
				return p;
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
		// Use the absolute dotnet path so VS Code opened from the Dock works.
		// Falls back to the plain 'dotnet' string if not found yet; ensureMacOsRuntime
		// will handle the "not found" case before the task is launched.
		const dotnet = findDotnet() ?? 'dotnet';
		return { command: dotnet, prefixArgs: [executable], folder };
	}
	return { command: executable, prefixArgs: [], folder };
}

// ─── .NET runtime detection & installation (macOS only) ──────────────────────

interface RuntimeFramework {
	name: string;
	version: string;
}

/**
 * Reads the required .NET runtime version from `Sindarin.runtimeconfig.json`
 * which lives next to `Sindarin.dll` and is generated at publish time.
 */
function readRequiredRuntime(dllPath: string): RuntimeFramework | undefined {
	const configPath = dllPath.replace(/\.dll$/i, '.runtimeconfig.json');
	if (!fs.existsSync(configPath)) {
		return undefined;
	}
	try {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
			runtimeOptions?: { framework?: RuntimeFramework };
		};
		return config.runtimeOptions?.framework;
	} catch {
		return undefined;
	}
}

/**
 * Returns true if the given major .NET version is already installed.
 * Uses `dotnet --list-runtimes` which is fast (< 200 ms).
 */
function isRuntimeInstalled(dotnetPath: string, majorVersion: number): boolean {
	try {
		const result = cp.spawnSync(dotnetPath, ['--list-runtimes'], {
			encoding: 'utf8',
			timeout: 5000,
		});
		return (result.stdout ?? '').split('\n').some(line =>
			line.startsWith(`Microsoft.NETCore.App ${majorVersion}.`),
		);
	} catch {
		return false;
	}
}

/**
 * Runs the official Microsoft dotnet-install.sh script in a visible VS Code
 * terminal task so the user can follow progress.
 * The script installs the runtime to ~/.dotnet without requiring sudo.
 */
async function installDotnetRuntime(majorVersion: number): Promise<boolean> {
	const taskName = `Install .NET ${majorVersion} runtime`;
	const script =
		`curl -sSL ${DOTNET_INSTALL_SCRIPT_URL}` +
		` | bash -s -- --runtime dotnet --channel ${majorVersion}.0`;

	const task = new vscode.Task(
		{ type: 'sindarin-dotnet-install' },
		vscode.TaskScope.Workspace,
		taskName,
		'sindarin',
		new vscode.ShellExecution(script),
	);

	await vscode.tasks.executeTask(task);

	return new Promise<boolean>(resolve => {
		// 5-minute safety timeout
		const timer = setTimeout(() => {
			disposable.dispose();
			resolve(false);
		}, 300_000);

		const disposable = vscode.tasks.onDidEndTaskProcess(e => {
			if (e.execution.task.name !== taskName) {
				return;
			}
			clearTimeout(timer);
			disposable.dispose();
			if (e.exitCode === 0) {
				vscode.window.showInformationMessage(
					`.NET ${majorVersion} runtime installed successfully.`,
				);
				resolve(true);
			} else {
				vscode.window.showErrorMessage(
					`Failed to install .NET ${majorVersion} runtime. ` +
					`Please install it manually from https://dotnet.microsoft.com/download/dotnet/${majorVersion}.0`,
				);
				resolve(false);
			}
		});
	});
}

/**
 * Checks that the .NET runtime required by Sindarin is available on macOS.
 * The required version is read from `Sindarin.runtimeconfig.json` so this
 * check stays correct automatically when Sindarin targets a newer .NET.
 *
 * If dotnet is missing entirely, or the required runtime version is not
 * installed, the user is offered two options:
 *   - "Install automatically" — runs dotnet-install.sh (no sudo required)
 *   - "Download page"         — opens the official .NET download page
 *
 * Returns true when Sindarin can be launched, false when the user should
 * take action first.
 */
async function ensureMacOsRuntime(launcher: SindarinLauncher): Promise<boolean> {
	if (macOsRuntimeVerified) {
		return true;
	}

	const dotnet = launcher.command;
	const dllPath = launcher.prefixArgs[0];

	// ── Step 1: is dotnet available at all? ──────────────────────────────────
	// launcher.command is an absolute path when findDotnet() succeeded, or the
	// plain string 'dotnet' as a fallback when it was not found.
	if (!path.isAbsolute(dotnet)) {
		// dotnet was not found on PATH or in any known location
		const required = readRequiredRuntime(dllPath);
		const majorVersion = required
			? parseInt(required.version.split('.')[0], 10)
			: 10; // safe default

		const choice = await vscode.window.showErrorMessage(
			`The .NET ${majorVersion} runtime is required to run Sindarin on macOS but was not found.`,
			'Install automatically',
			'Download page',
		);
		if (choice === 'Download page') {
			vscode.env.openExternal(
				vscode.Uri.parse(
					`https://dotnet.microsoft.com/en-us/download/dotnet/${majorVersion}.0`,
				),
			);
		} else if (choice === 'Install automatically') {
			await installDotnetRuntime(majorVersion);
		}
		return false; // user must restart VS Code after install so PATH is refreshed
	}

	// ── Step 2: is the required runtime version installed? ───────────────────
	const required = readRequiredRuntime(dllPath);
	if (!required) {
		// Cannot determine the required version — proceed optimistically
		macOsRuntimeVerified = true;
		return true;
	}

	const majorVersion = parseInt(required.version.split('.')[0], 10);

	if (isRuntimeInstalled(dotnet, majorVersion)) {
		macOsRuntimeVerified = true;
		return true;
	}

	// Required runtime is missing
	const choice = await vscode.window.showWarningMessage(
		`.NET ${majorVersion} runtime is required to run Sindarin on macOS but is not installed.`,
		'Install automatically',
		'Download page',
	);

	if (choice === 'Download page') {
		vscode.env.openExternal(
			vscode.Uri.parse(
				`https://dotnet.microsoft.com/en-us/download/dotnet/${majorVersion}.0`,
			),
		);
		return false;
	}

	if (choice === 'Install automatically') {
		const ok = await installDotnetRuntime(majorVersion);
		if (ok) {
			macOsRuntimeVerified = true;
		}
		return ok;
	}

	return false;
}

// ─────────────────────────────────────────────────────────────────────────────

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

	if (isMac) {
		const dotnet = findDotnet() ?? 'dotnet';
		return { command: dotnet, args: [installer, launcher.folder] };
	}
	return { command: installer, args: [launcher.folder] };
}

async function runSindarin(mode: SindarinMode): Promise<void> {
	let launcher = resolveSindarin();
	if (!launcher) {
		showNotFound();
		return;
	}

	// macOS: verify dotnet is available and the required runtime is installed
	// before attempting to launch. Re-resolves after a successful install so
	// the newly found ~/.dotnet/dotnet path is picked up.
	if (process.platform === 'darwin' && launcher.prefixArgs.length > 0) {
		if (!(await ensureMacOsRuntime(launcher))) {
			return;
		}
		// Re-resolve: if dotnet was just installed it is now at ~/.dotnet/dotnet
		launcher = resolveSindarin() ?? launcher;
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
