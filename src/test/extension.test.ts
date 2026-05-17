import * as assert from 'assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'sindarincorp.sindarin-lang';
const COMMANDS = [
	'sindarin-lang.interpret',
	'sindarin-lang.walk',
	'sindarin-lang.update',
	'sindarin-lang.manual',
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
