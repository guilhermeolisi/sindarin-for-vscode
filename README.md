# sindarin-for-vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/goSiqueira.sindarin-for-vscode.svg?color=orange&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)

[Sindarin for VS Code](https://github.com/guilhermeolisi/sindarin-for-vscode) for [VSCcode](https://code.visualstudio.com/)

Sindarin for Visual Studio Code is an extension that includes some features to make the Sindarin program easier to use with this powerful text editor.

Sindarin is a crystal diffraction calculation program that uses a dedicated script, which is simple, flexible and enables a range of possibilities for modeling theoretical diffraction patterns. 

**This extension is still a beta version**

## Features

The extension enables Sindarin code highlighting. Sindarin "language" is automatically enabled by the extension when the file with the ".sin" extension is opened in the editor or it can be enabled manually by selecting the "language mode selector" in the status bar. 

![Sindarin Code Highlighting](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinCodeHighlithing.png?raw=true)

![Sindarin Language in language mode selector](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinStatusBarLanguage.png?raw=true)

2 commands are enable:
* Interpet: run sindarin to interpret for the current sindarin file (Shortcut: Ctrl+Alt+Down Arrow)
* Walk: run sindarin to interpret and run optimization routine for the current sindarin file (Shortcut: Ctrl+Alt+Right Arrow)

These commands can be acessed by Command Pallete, short cut or two dedicated icons in editor title. 
![Sindarin commands in Command Pallete](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinCommands.png?raw=true)

![Sindarin icons in editor title](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinIcons.png?raw=true)

These commands are automatically enabled with the Sindarin language signed text

Also, the [Chart.js Preview](https://github.com/chartjs/Chart.js) extension is installed together with the sindarin extension. You can view in VS Code the diffractograms of the .chart.json5 file generated after the sindarin commands

![View diffraction in VS Code wit Chart.js](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinDiffractionChart.js.png?raw=true)

## Requirements

It is necessary to download the Sindarin program from the website:.
the program needs to be in the default folder on your computer:
* Windows: c:\Sindarin
* Linux and macOS: \Sindarin

If you want other folder, you need to include the path of this folder in the PATH environment variable in your operating system to allow the extension to find the Sindarin program. 

## Download Sindarin library

Sindarin for:
* [Windows](https://sindarin.s3.sa-east-1.amazonaws.com/installerwindows.zip)
* [Linux](https://sindarin.s3.sa-east-1.amazonaws.com/installerlinux.zip)
* [macOS](https://sindarin.s3.sa-east-1.amazonaws.com/installermacos.zip)

**Good Work!**
