# sindarin-for-vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/goSiqueira.sindarin-for-vscode.svg?color=orange&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/goSiqueira.sindarin-for-vscode.svg?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)

[Sindarin](https://github.com/guilhermeolisi/sindarin-for-vscode) for [VS Code](https://code.visualstudio.com/)

Sindarin for Visual Studio Code is an extension that includes some features to make the Sindarin program easier to use with this powerful text editor.

Sindarin is a crystal diffraction calculation program that uses a dedicated input script for modeling theoretical diffraction patterns. The script is designed to be simple, flexible and enables a range of possibilities for the calcules.

**This extension is still a beta version**

## Features of Sindarin for VS Code

The extension enables Sindarin code highlighting. Sindarin "language" is automatically enabled by the extension when the file with the ".sin" extension is opened in the editor or it can be enabled manually by selecting the "language mode selector" in the status bar. 

![Sindarin Code Highlighting](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinCodeHighlithing.png?raw=true)

![Sindarin Language in language mode selector](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinStatusBarLanguage.png?raw=true)

Some commands are enable in VS Code:
1. Interpet: run sindarin to interpret for the current sindarin file (Shortcut: Ctrl+Shift+Down Arrow)
2. Walk: run sindarin to interpret and run optimization routine for the current sindarin file (Shortcut: Ctrl+Shift+Right Arrow)
3. Update: run sindarin to update program form online repositorie, need internet connection (Shortcut: Ctrl+Shift+U)
4. Manual: open the manual of sindarin program/library (Shortcut: Ctrl+Shift+M)

These commands can be acessed by Command Pallete, short cut or dedicated icons in editor title. 
![Sindarin commands in Command Pallete](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinCommands.png?raw=true)

![Sindarin icons in editor title](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinIcons.png?raw=true)

The icons are automatically enabled with the Sindarin language signed text

Also, the [Chart.js Preview](https://github.com/chartjs/Chart.js) extension is installed together with the sindarin extension. You can view in VS Code the diffractograms of the .chart.json5 file generated after the interpret or walk commands

![View diffraction in VS Code wit Chart.js](https://github.com/guilhermeolisi/sindarin-for-vscode/blob/master/resources/SindarinDiffractionChart.js.png?raw=true)

## Requirements

It is necessary to download the Sindarin program from the website.
the program needs to be in the default folder on your computer:
* Windows: C:\Sindarin
* Linux: ~/Sindarin
* macOS: ~/Sindarin

If you want other folder, you need to include the path in the PATH environment variable in your operating system to allow the extension to find and run the Sindarin program. If you don't use the default folder the update cannot be completed within VS Code on Linux and macOS, but it will work normally by command line. On Windows it will work normally within VS Code.

On macOS it is necessary the [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) runtime installed on the machine.

### Download Sindarin

Download the compacted file for:
* [Windows 64x](https://sindarin.s3.sa-east-1.amazonaws.com/windows64.zip)
* [Windows 86x](https://sindarin.s3.sa-east-1.amazonaws.com/windows86.zip)
* [Linux 64x](https://sindarin.s3.sa-east-1.amazonaws.com/linux64.zip)
* [macOS 64x](https://sindarin.s3.sa-east-1.amazonaws.com/macos64.zip)

Unzip the downloaded file to standard folder. On linux, the program was tested only on Ubuntu distribution

## About Sindarin Library

Sindarin is a computer library for crystal diffraction calculations. It can be run by some command lines by the "Sindarin" executable. Sindarin for VSCode is an extension of this text editor that allows the same features without typing any command line, besides facilitating the editing of the sindarin file (.sin) and showing the diffractograms resulting from the calculation in the editor itself. The Sindarin file is a plain text file written with a simple and flexible syntax that is used as input to diffraction model information. The text is "interpreted" by the algorithm, and then objects representing the diffraction experiment are created in the memory and the theoretical diffractogram is calculated. The optimization algorithm nonlinear least squares (NLS) with Marquart or dumping stabilization is used to fit the parameters.

A dedicated code editor with various diffraction and syntax tools will be available soon.

### Some Features

* Rietveld refinement with full crystal strucutre calculation
* Le Bail and --- refinements without atoms information, only lattice parameters
* Calculation of profiles without any crystallographic information 
    * with isotropic and anisotropic function for size and microstrain
* Fundamental Parameters Approach (FPA), for an accurate instrumental profile calculation
* Whole Pattern Powder Modeling (WPPM), for microstrucutre calculation
    * Size crystals distribuction for some geometries
    * Dislocation
    * Stacking fault
* Intensity corrections
    * Lorentz-Polarization 
    * Absorption Capillary sample
    * Absorption Thin Film
    * Variable Slit
    * Preferred orientation
    * Custom absorption function correction
    * Arbitraty peak intensity correction
* Peak position correction
    * Zero
    * Sample Displacement
        * Flat speciment (reflection geometry)
        * Capillary sepciment (tramission geometry)
    * From Capillary speciment absorption
    * Arbitrary peak shift
* Diffractometers geometries
    * Bragg Bretano
    * Fixed incident angle
* Anomalous Scattering
    * Internal values of each atoms
    * Refinable anomalous scattering factors
* Background can be fitted with multiples function
    * Pre-determined functions
    * Custom background function
* Multiple data file
* Simultaneous refinement of multiple diffraction measurements

At the moment Sindarin calcule **Powder X-Ray Diffraction** Pattern

More information about Sindarin can be found in the manual.

**Have a Good Work!**
