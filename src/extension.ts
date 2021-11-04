// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//var vscode2 = require("vscode");
import * as cp from "child_process";
import path = require('path');
import { setTimeout } from 'timers';

var hasSinEnv: boolean;
var pathSin: string;
var OSIndex: number = -1;

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "sindarin-for-vscode" is now active!');

	// vscode.languages.registerHoverProvider(
	// 	{ pattern: '**.sin' },
	// 	{
	// 		provideHover(doc: vscode.TextDocument) {
	// 			return new vscode.Hover('For Sindarin documents');
	// 		}
	// 	}
	// );

	getOutputChannel().appendLine("Start Sindarin extension");
	await VerifyOS();

	let updateCommand = vscode.commands.registerCommand('sindarin-for-vscode.update', () => {
		InterpreterCommand("update");
	});
	context.subscriptions.push(updateCommand);

	let interpretCommand = vscode.commands.registerCommand('sindarin-for-vscode.interpret', () => {
		InterpreterCommand("interpret");
	});
	context.subscriptions.push(interpretCommand);

	let walkCommand = vscode.commands.registerCommand('sindarin-for-vscode.walk', () => {
		InterpreterCommand("walk");
	});
	context.subscriptions.push(walkCommand);


}
// this method is called when your extension is deactivated
export function deactivate() { }

async function InterpreterCommand(mode: string): Promise<void> {
	var commandLinePower: string; // = "Sindarin";

	if (hasSinEnv) {
		commandLinePower = "Sindarin";
	}
	else if (pathSin) {
		commandLinePower = path.join(pathSin, "Sindarin");
	}
	else {
		await VerifyOS();
		if (pathSin) {
			commandLinePower = path.join(pathSin, "Sindarin");
		}
		else {
			if (OSIndex === 0) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: C:\\Sindarin');
			}
			else if (OSIndex === 1) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin');
			}
			else if (OSIndex === 2) {
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin');
			}
			else {
				//TODO mesnagem que não reconheceu o commandline do OS
			}
			return;
		}
	}
	var command: string;
	if (OSIndex === 0) {
		//commandLinePower = "sudo " + commandLinePower;
	}
	else if (OSIndex === 1) {
		//vscode.window.showInformationMessage('Sindarin program is not found in default folder: C:\\Sindarin');
	}
	else if (OSIndex === 2) {
		//vscode.window.showInformationMessage('Sindarin program is not found in default folder: /Sindarin');
	}
	else {
		//TODO mesnagem que não reconheceu o commandline do OS
	}

	//const file = vscode2.window.activeTextEditor.document.uri.fsPath;
	const doc = vscode.window.activeTextEditor?.document;
	const dirt = vscode.window.activeTextEditor?.document.isDirty;
	if (doc?.isUntitled) {
		const saved = await doc.save();
		vscode.window.showInformationMessage(`Document ${saved ? "was" : "was not"} saved. Check document is still open.`);
		if (!saved) {
			return;
		}
	}
	else if (doc) {
		//const saved = await doc.save();
		const saved = vscode.window.activeTextEditor?.document.save();
		if (!saved) {
			return;
		}
	}
	var file;
	if (vscode.window.activeTextEditor) {
		file = vscode.window.activeTextEditor?.document.uri.fsPath;
	}
	else {
		return;
	}
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
	var taskTemp: vscode.Task;
	if (mode !== 'update') {
		if (OSIndex !== 2) {
			taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin ${mode}`, definition.type,
				new vscode.ShellExecution(commandLinePower, [fileName, "--" + mode, "--all", "--code"], options), [""]);
		}
		else {
			taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin ${mode}`, definition.type,
				new vscode.ShellExecution("dotnet", [commandLinePower + "dll", fileName, "--" + mode, "--all", "--code"], options), [""]);
		}
	}
	else {
		if (OSIndex !== 2) {
			taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin ${mode}`, definition.type,
				new vscode.ShellExecution(commandLinePower, ["--" + mode, "--code"], options), [""]);
		}
		else {
			taskTemp = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin ${mode}`, definition.type,
				new vscode.ShellExecution("dotnet", [commandLinePower + ".dll", "--" + mode, "--code"], options), [""]);
		}
	}
	vscode.tasks.executeTask(taskTemp);

}

async function VerifyOS(): Promise<void> {

	//https://natclark.com/tutorials/javascript-check-operating-system/
	// let os = `Undetected`;
	// if (vscode2.appVersion.indexOf("Win") !== -1) {
	// 	//os = `Windows`;
	// 	OSIndex = 0;
	// }
	// else if (vscode2.appVersion.indexOf("Linux") !== -1) {
	// 	//os = `Linux`;
	// 	OSIndex = 1;
	// }
	// else if (vscode2.appVersion.indexOf("Mac") !== -1) {
	// 	//os = `MacOS`;
	// 	OSIndex = 2;
	// }
	// else if (vscode2.appVersion.indexOf("X11") !== -1) {
	// 	//os = `UNIX`;
	// 	OSIndex = 3;
	// }
	// return os;


	const options: vscode.ShellExecutionOptions = {};

	//button na mensagem
	//https://stackoverflow.com/questions/57416105/how-to-make-a-click-event-in-vscode-window-showinformationmessage

	// let GoToHelp = 'Go to Help';
	// vscode.window.showInformationMessage('Click for more Info', GoToHelp)
	// 	.then(selection => {
	// 		if (selection === GoToHelp) {
	// 			vscode.env.openExternal(vscode.Uri.parse(
	// 				'https://www.merriam-webster.com/dictionary/hep'));
	// 		}
	// 	});

	//Verifica o executável Sindarin
	let downloadInstall = 'Download';
	let goToWebsite = "Go to website";

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
			OSIndex = 1;
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
				// vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin', downloadInstall)
				// 	.then(async selection => {
				// 		if (selection === downloadInstall) {
				// 			await InstallSindarin();
				// 		}
				// 	});
				vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin', goToWebsite)
					.then(async selection => {
						if (selection === goToWebsite) {
							vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode"));
							return;
						}
					});
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
				OSIndex = 0;
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
					// vscode.window.showInformationMessage('Sindarin program is not found in default folder: c:\\Sindarin', downloadInstall)
					// 	.then(async selection => {
					// 		if (selection === downloadInstall) {
					// 			await InstallSindarin();
					// 		}
					// 	});
					vscode.window.showInformationMessage('Sindarin program is not found in default folder: c:\\Sindarin', goToWebsite)
						.then(async selection => {
							if (selection === goToWebsite) {
								vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode"));
								return;
							}
						});

				}
			}
			//Verifica se é macOS
			else {
				//Fazer um comando para verificar se é macOS
				try {
					testOS2 = await execShell("sw_vers", options);
				}
				catch {
					testOS2 = null;
				}
				if (testOS2) {
					OSIndex = 2;
					var verifyDotNet: boolean;
					try {
						verifyDotNet = await execShellBool("dotnet ~/Sindarin/Sindarin.dll", options);
					}
					catch {
						verifyDotNet = false;
					}
					if (!verifyDotNet) {
						vscode.window.showInformationMessage('The Sindarin program for macOS needs .Net installed in the system. See more information on the website', goToWebsite)
							.then(async selection => {
								if (selection === goToWebsite) {
									vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode"));
									return;
								}
							});
					}
					try {
						verifySin = await execShellBool("dotnet ~/Sindarin/Sindarin.dll", options);
					}
					catch {
						verifySin = false;
					}
					if (verifySin) {
						pathSin = "~/Sindarin";
					}
					else {
						vscode.window.showInformationMessage('Sindarin program is not found in default folder: ~/Sindarin', goToWebsite)
							.then(async selection => {
								if (selection === goToWebsite) {
									vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode"));
									return;
								}
							});
					}
				}
				else {
					vscode.window.showInformationMessage('Operation system not identified', goToWebsite)
						.then(async selection => {
							if (selection === goToWebsite) {
								vscode.env.openExternal(vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode"));
								return;
							}
						});
				}
			}
		}
	}
}

async function InstallSindarin(): Promise<void> {



	//https://ostechnix.com/how-to-compress-and-decompress-files-in-linux/

	//WIndows: Expand-Archive -LiteralPath <PathToZipFile> -DestinationPath <PathToDestination>
	//Linux: $ gunzip ostechnix.txt.gz
	//gzip -c -d output.txt.gz > ostechnix1.txt

	//Tem que verificar se wget está instalado no linux
	//--no-check-certificate
	//https://linuxize.com/post/how-to-install-deb-packages-on-ubuntu/
	//curl -k -O -L https://download.teamviewer.com/download/linux/teamviewer_amd64.deb
	//wget --no-check-certificate --no-clobber https://download.teamviewer.com/download/linux/teamviewer_amd64.deb
	//https://www.tutorialrepublic.com/faq/how-to-extract-a-tar-gz-file-using-command-line-in-ubuntu.php
	//tar -xvzf /path/to/filename.tar.gz -C /path/to/destination_folder 

	var uri = 'https://sindarin.s3.sa-east-1.amazonaws.com';
	var fileZip; // = "sindarin.zip"
	var fileSindarin = "Sindarin";
	var fileUpdate = "SindarinUpdate";
	var sindarinFolder: string;
	var commandDownload;
	var commandUnzip;
	var commandSinFolder;
	var argsFolder;
	var cpDownload;
	var cpUnzip;
	var argsDonwload: string[] = [""];
	var argsZip: string[] = [""];
	if (OSIndex === 0) {
		//Invoke-WebRequest -Uri https://sindarin.s3.sa-east-1.amazonaws.com/windows64.zip -OutFile C:\\sindarin.zip
		//https://www.ryandrane.com/2015/06/run-script-or-command-as-admin-in-powershell/
		//Start-Process powershell.exe -Verb RunAs -ArgumentList "Invoke-WebRequest -Uri https://sindarin.s3.sa-east-1.amazonaws.com/windows64.zip -OutFile C:\\sindarin.zip"
		uri = uri + "/windows64.zip";
		fileZip = "C:\\Sindarin\\sindarin.zip";
		sindarinFolder = "C:\\Sindarin";

		commandDownload = "Invoke-WebRequest";
		argsDonwload = ["-Uri", uri, "-OutFile", fileZip];
		// commandDownload = "Start-Process";
		// argsDonwload = ["powershell.exe", "-Verb", "RunAs", "-ArgumentList", '\"Invoke-WebRequest -Uri '+uri + ' -OutFile ' + fileZip +'\"'];

		commandUnzip = "Expand-Archive";
		argsZip = ["-LiteralPath", fileZip, "-DestinationPath", sindarinFolder];
		// commandUnzip = "Start-Process";
		// argsZip = ["powershell.exe", "-Verb", "RunAs", "-ArgumentList", '\"Expand-Archive -LiteralPath '+fileZip + ' -DestinationPath ' + sindarinFolder +'\"'];

		fileSindarin = "\\" + fileSindarin + ".exe";
		fileUpdate = "\\" + fileUpdate + ".exe";

		//Start-Process powershell.exe -ArgumentList
		commandSinFolder = "Start-Process";
		argsFolder = ["powershell.exe", "-Verb", "RunAs", "-ArgumentList", '\"md ' + sindarinFolder + '\"'];
	}
	else if (OSIndex === 1) {
		uri = uri + "/linux64.tar.gz";
		fileZip = "~/linux64.tar.gz";
		sindarinFolder = "~/Sindarin";
		//commandDownload = "curl";
		//args = ["-k", "-O", "-L", uri];
		commandDownload = "wget";
		argsDonwload = ["--no-check-certificate", "--no-clobber", "-O", fileZip, uri];

		//commandUnzip = "gunzip";
		//argsZip = [fileZip];
		//argsZip =["-c", "-d", fileZip, ">", "/"];
		//tar -xvzf ~/linux64.tar.gz -C ~/Sindarin
		commandUnzip = "tar";
		argsZip = ["-xvzf", fileZip, "-C", "~/Sindarin"];
		fileSindarin = "/" + fileSindarin;
		fileUpdate = "/" + fileUpdate;

		cpDownload = "wget --no-check-certificate --no-clobber " + uri;
		cpUnzip = "gunzip " + fileZip;

		commandSinFolder = "mkdir";
		argsFolder = [sindarinFolder];
	}
	else if (OSIndex === 2) {
		uri = uri + "/macos64.zip";
		fileZip = "/sindarin.zip";
		sindarinFolder = "/Sindarin";
	}
	else {
		sindarinFolder = "";
	}
	if (!fileZip || !commandDownload || !commandUnzip || !commandSinFolder || !argsFolder)
		return;


	//const sindarinFolder = path.dirname(fileZip);
	var options: vscode.ShellExecutionOptions;
	if (OSIndex) {
		options = {
			//cwd: sindarinFolder,
			cwd: "c:\\"
		};
	}
	else {
		options = {};
	}
	const definition: vscode.TaskDefinition = {
		type: "shell"
	};


	var haszip: boolean;
	try {
		//ls é para linux e powershell
		haszip = await execShellBool("ls " + fileZip, options);
	}
	catch {
		haszip = false;
	}
	//No such file or directory
	const taskDownload = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
		new vscode.ShellExecution(commandDownload, argsDonwload, options), [""]);

	var hasSinFolder;
	var taskFolder: vscode.Task;
	try {
		hasSinFolder = await execShellBool("cd " + sindarinFolder, options);
	}
	catch {
		hasSinFolder = false;
	}
	if (!hasSinFolder) {
		taskFolder = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
			new vscode.ShellExecution(commandSinFolder, argsFolder, options), [""]);
		//vscode.tasks.executeTask(taskFolder);
	}
	else {
		//Deleto todo diretório?
		taskFolder = taskDownload;
	}

	//Descompacta
	const taskUnzip = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
		new vscode.ShellExecution(commandUnzip, argsZip, options), [""]);
	//vscode.tasks.executeTask(taskUnzip);

	var cont: boolean = false;
	var size: string = "";
	var size2: string = "";

	if (!hasSinFolder) {
		try {
			await vscode.tasks.executeTask(taskFolder);
			hasSinFolder = true;
		}
		catch {
			hasSinFolder = false;
		}
		await sleep(500);
	}
	if (!haszip) {
		// if (OSIndex === 0) {
		// 	//Set-ExecutionPolicy "Unrestricted"
		// 	try {
		// 		const temp = await execShell("Set-ExecutionPolicy \"Unrestricted\"", options);
		// 		const temp2 = temp;
		// 		if (temp2) {

		// 		}
		// 	}
		// 	catch {

		// 	}
		// }
		var count = 0;
		try {
			await vscode.tasks.executeTask(taskDownload);
		}
		catch {
			cont = false;
		}
		while (!cont) {
			try {
				if (OSIndex === 0) {
					try {
						//size = await execShell("Write-Host((Get-Item " + fileZip + ").length/1KB)", options);	//Write-Host((Get-Item UBT_Uninstalllog.txt).length/1KB)
						size = await execShell("Start-Process powershell.exe -ArgumentList \"Write-Host((Get-Item " + fileZip + ").length/1KB)\"", options);
					}
					catch {
						size = count.toString();
						count = count + 1;
						if (count === 20) {
							return;
						}
					}
				}
				if (OSIndex === 1) {
					size = await execShell("du -hs " + fileZip, options);
				}
				if (size === size2) {
					cont = true;
				}
				else {
					cont = false;
					size2 = size;
				}
			}
			catch {
				cont = false;
			}
			if (!cont) {
				await sleep(1000);
			}
		}
	}
	vscode.tasks.executeTask(taskUnzip);
	while (!cont) {
		try {
			if (OSIndex === 0) {
				//(Get-ChildItem C:\PowderCell -Recurse | Measure-Object -Property Length -Sum).Sum
				size = await execShell("Get-ChildItem " + sindarinFolder + " -Recurse | Measure-Object -Property Length -Sum).Sum", options);
			}
			else if (OSIndex === 1) {
				size = await execShell("du -hs " + sindarinFolder, options);
			}
			if (size === size2) {
				cont = true;
			}
			else {
				cont = false;
				size2 = size;
			}
		}
		catch {
			cont = false;
		}
		if (!cont) {
			await sleep(1000);
		}
	}

	if (OSIndex === 1) {
		//permitir a execução dos sindarin e sindarinupdate

		var commandLinePower = "sudo";
		const args = ["chmod", "u+x", sindarinFolder + fileSindarin];
		const task1 = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
			new vscode.ShellExecution(commandLinePower, args, options), [""]);


		//vscode.tasks.executeTask(taskDownload).then(()=>vscode.tasks.executeTask(taskFolder)).then(() => vscode.tasks.executeTask(taskUnzip).then(() => vscode.tasks.executeTask(task1)));
		//du -hs /path/to/directory
		//https://askubuntu.com/questions/1224/how-do-i-determine-the-total-size-of-a-directory-folder-from-the-command-line

		vscode.tasks.executeTask(task1);

		// if (hasSinFolder) {
		// 	//vscode.tasks.executeTask(taskDownload).then(() => vscode.tasks.executeTask(taskUnzip).then(() => vscode.tasks.executeTask(task1)));
		// 	await vscode.tasks.executeTask(taskDownload);
		// 	await vscode.tasks.executeTask(taskUnzip);
		// 	await vscode.tasks.executeTask(task1);
		// }
		// else {

		// }
	}

	//Se for linux tem que habilitar ainda a execução do sindarin e do update
	if (OSIndex === 1) {
		//Descompactar o tar

		//chmod u+x
		// var commandLinePower = "sudo";
		// args = ["chmod", "u+x", sindarinFolder + fileSindarin];
		// const task1 = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
		// 	new vscode.ShellExecution(commandLinePower, args, options), [""]);
		//await 

		// args = ["chmod", "u+x", sindarinFolder + fileUpdate];
		// const task2 = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
		// 	new vscode.ShellExecution(commandLinePower, args, options), [""]);
		// vscode.tasks.executeTask(task2);

		//vscode.tasks.executeTask(taskDownload).then(() => vscode.tasks.executeTask(taskUnzip).then(() => vscode.tasks.executeTask(task1)));
		//vscode.tasks.executeTask(task1);
	}
	else {
		//await vscode.tasks.executeTask(taskDownload).then(() => vscode.tasks.executeTask(taskUnzip));
	}
}
// function sleep(ms: number) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
//}
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

async function downloadSindarin(definition: vscode.TaskDefinition, commandDownload: string, args: string[], options: vscode.ShellExecutionOptions): Promise<void> {
	const taskDownload = new vscode.Task(definition, vscode.TaskScope.Workspace, `Sindarin install`, definition.type,
		new vscode.ShellExecution(commandDownload, args, options), [""]);
	vscode.tasks.executeTask(taskDownload);
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
