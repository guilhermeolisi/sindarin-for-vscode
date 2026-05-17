import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'goSiqueira.sindarin-for-vscode';
const COMMANDS = [
	'sindarin-for-vscode.interpret',
	'sindarin-for-vscode.walk',
	'sindarin-for-vscode.update',
	'sindarin-for-vscode.manual',
];

suite('Sindarin extension', () => {
	test('extension is present', () => {
		assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
	});

	test('activates and registers all commands', async () => {
		await vscode.extensions.getExtension(EXTENSION_ID)?.activate();
		const registered = await vscode.commands.getCommands(true);
		for (const command of COMMANDS) {
			assert.ok(registered.includes(command), `missing command: ${command}`);
		}
	});
});
