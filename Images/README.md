# sindarin-for-vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/goSiqueira.sindarin-for-vscode.svg?color=orange&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)

[Sindarin for VS Code](https://github.com/chartjs/Chart.js) for [VSCcode](https://code.visualstudio.com/)

Sindarin for Visual Studio Code is an extension that includes some features to make the Sindarin program easier to use with this powerful text editor.
Sindarin is a crystal diffraction calculation program that uses a dedicated script, which is simple, flexible and enables a range of possibilities for modeling theoretical diffraction patterns. 

## Features

The extension enables Sindarin code highlighting. Sindarin "language" is automatically enabled by the extension when the file with the ".sin" extension is opened in the editor or it can be enabled manually by selecting the "language mode selector" in the status bar. 

![Sindarin Code Highlighting](resources/SindarinCodeHighlithing.png)
![Sindarin Language in language mode selector](resources/SindarinStatusBarLanguage.png)

2 commands are enable:
1. Interpet: run sindarin to interpret for the current sindarin file (Shortcut: Ctrl+Alt+Down Arrow)
2. Walk: run sindarin to interpret and run optimization routine for the current sindarin file (Shortcut: Ctrl+Alt+Right Arrow)

These commands can be acessed by Command Pallete, short cut or two dedicated icons in editor title. 
![Sindarin commands in Command Pallete](resources/SindarinCommands.png)
![Sindarin icons in editor title](resources/SindarinIcons.png)

These commands are automatically enabled with the Sindarin language signed text

Also, the [Chart.js Preview](https://github.com/chartjs/Chart.js) extension is installed together with the sindarin extension. You can view in VS Code the diffractograms of the .chart.json5 file generated after the sindarin commands

![View diffraction in VS Code wit Chart.js](resources/SindarinDiffractionChart.js.png)

## Requirements

It is necessary to download the Sindarin program from the website:.
the program needs to be in the default folder on your computer:
. Windows: c:\indarin
. Linux and macOS: ~/Sindarin
If you want another folder, you need to include the path of this folder in the PATH environment variable in your operating system to allow the extension to find the Sindarin program. 

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
