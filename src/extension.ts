// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var vscode2 = require("vscode");
import * as cp from "child_process";
import path = require('path');

var hasSinEnv: boolean;
var pathSin: string;
var OSIndex: number = -1;

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "sindarin-for-vscode" is now active!');

	vscode.languages.registerHoverProvider(
		{ pattern: '**.sin' },
		{
			provideHover(doc: vscode.TextDocument) {
				return new vscode.Hover('For Sindarin documents');
			}
		}
	);

	getOutputChannel().appendLine("Start Sindarin extension");
	await VerifyOS();

	let interpretCommand = vscode.commands.registerCommand('sindarin-for-vscode.interpret', () => {
		//vscode.window.showInformationMessage('Hello World from Sindarin for vscode!');
		InterpreterCommand("interpret");
	});
	context.subscriptions.push(interpretCommand);

	let walkCommand = vscode.commands.registerCommand('sindarin-for-vscode.walk', () => {
		//vscode.window.showInformationMessage('Hello World from Sindarin for vscode!');
		InterpreterCommand("walk");
	});

	context.subscriptions.push(walkCommand);
	
}
// this method is called when your extension is deactivated
export function deactivate() { }

async function InterpreterCommand(mode:string): Promise<void> {
	var commandLinePower: string; // = "Sindarin";

		if (hasSinEnv) {
			commandLinePower = "Sindarin";
		}
		else if (pathSin) {
			commandLinePower = path.join(pathSin, "Sindarin");
		}
		else {
			if (OSIndex === 0) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin');
			}
			else if (OSIndex === 1) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: C:\\Sindarin');
			}
			else if (OSIndex === 2) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: /Sindarin');
			}
			else {
				//TODO mesnagem que não reconheceu o commandline do OS
			}
			return;
		}

		const file = vscode2.window.activeTextEditor.document.uri.fsPath;

		//https://blog.heshamamin.com/2009/04/calling-powershell-script-in-path-with.html
		//const commandLinePower = "C:\\\'SD Card\'\\Guilherme\\Documentos\\Acadêmico\\VisualStudio\\Sindarin\\Sindarin\\bin\\Release\\net5.0\\publish\\windows64\\Sindarin.exe";

		if (path.extname(file).toUpperCase() !== '.SIN') {
			//TODO enviar mensagem para terminal dizendo que o arquivo não é no formato apropriado
			return;
		}
		const fileName = path.basename(file);
		const folder = path.dirname(file);
		const options: vscode.ShellExecutionOptions = {
			cwd: folder,
		};
		const definition: vscode.TaskDefinition = {
			type: "shell"
		};

		// const taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `TestTask ${definition.number}`, definition.type,
		// 	new vscode.ShellExecution("\"& {&\'" + commandLinePower + "\' " + fileName + " --walk --all --json " + "}\"", options), [""]);
		const taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin ${mode}`, definition.type,
			new vscode.ShellExecution(commandLinePower, [fileName, "--" + mode, "--all", "--json"], options), [""]);
		vscode.tasks.executeTask(taskTemp);
}

async function VerifyOS(): Promise<void> {
	const options: vscode.ShellExecutionOptions = {

	};
	//Verifica o executável Sindarin
	try {
		hasSinEnv = await execShellBool("Sindarin", options);
	}
	catch {
		hasSinEnv = false;
	}
	if (!hasSinEnv) {
		//Verifica se é Linux
		var testOS2;
		try {
			testOS2 = await execShell("cat /etc/os-release", options);
		}
		catch {
			testOS2 = null;
		}
		if (testOS2) {
			var verifySin;
			OSIndex = 0;
			try {
				verifySin = await execShellBool("~/Sindarin/Sindarin", options);
			}
			catch {
				verifySin = false;
			}
			if (verifySin) {
				pathSin = "~/Sindarin";
			}
			else {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin');
			}
		}
		else {
			//Verifica se é Windows
			try {
				const definition: vscode.TaskDefinition = {
					type: "shell",
				};
				const taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, "TestTask", definition.type,
					new vscode.ShellExecution('Get-WmiObject', ["-class", "Win32_OperatingSystem"], options), [""]);
				taskTemp.presentationOptions.reveal = vscode.TaskRevealKind.Never;
				vscode.tasks.executeTask(taskTemp);
				testOS2 = true;
			}
			catch {
				testOS2 = false;
			}
			if (testOS2) {
				OSIndex = 1;
				var verifySin;
				try {
					verifySin = await execShellBool("c:\\Sindarin\\Sindarin", options);
				}
				catch {
					verifySin = false;
				}
				if (verifySin) {
					pathSin = "C:\\Sindarin";
				}
				else {
					vscode.window.showInformationMessage('Sindarin program not found in default folder: C:\\Sindarin');
				}
			}
			//Verifica se é macOS
			else {
				//Fazer um comando para verificar se é macOS
				OSIndex = 2;
			}
		}
	}
}

let _channel: vscode.OutputChannel;
function getOutputChannel(): vscode.OutputChannel {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Rake Auto Detection');
	}
	return _channel;
}
const execShell = (cmd: string, options: vscode.ShellExecutionOptions) =>
	new Promise<string>((resolve, reject) => {
		cp.exec(cmd, options, (err, out) => {
			if (err) {
				return reject(err);
			}
			return resolve(out);
		});
	});
const execShellBool = (cmd: string, options: vscode.ShellExecutionOptions) =>
	new Promise<boolean>((resolve, reject) => {
		cp.exec(cmd, options, (err, out) => {
			if (err) {
				return reject(false);
			}
			return resolve(true);
		});
	});
