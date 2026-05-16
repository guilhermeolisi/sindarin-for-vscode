# sindarin-for-vscode

[![Version](https://img.shields.io/visual-studio-marketplace/v/goSiqueira.sindarin-for-vscode?color=orange&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/goSiqueira.sindarin-for-vscode?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/goSiqueira.sindarin-for-vscode?color=orange)](https://marketplace.visualstudio.com/items?itemName=goSiqueira.sindarin-for-vscode)

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

You need the Sindarin program installed on your computer. The extension locates it in the following order:

1. **`sindarin.executablePath` setting** *(recommended for custom locations)* — the full path to the Sindarin executable (or to `Sindarin.dll` on macOS). A leading `~` is expanded to your home folder.
2. **System PATH** — if `Sindarin` is available on your `PATH` it will be used.
3. **Default folder** — used when neither of the above is set:
   * Windows: `C:\Sindarin`
   * Linux: `~/Sindarin`
   * macOS: `~/Sindarin`

To set a custom path, open VS Code Settings, search for *Sindarin*, and fill in **Sindarin: Executable Path** — or add to your `settings.json`:

```json
{
  "sindarin.executablePath": "D:\\Tools\\Sindarin\\Sindarin.exe"
}
```

> When Sindarin is **not** in the default folder, the in-editor **Update** command may not complete on Linux and macOS (it still works from the command line). On Windows it works normally.

On macOS the [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) runtime must be installed on the machine.

### Download Sindarin

Download the package for your platform (current version **0.1.90.0**):

* [Windows x64](https://nimlothrelease.blob.core.windows.net/sindarinrelease/Sindarin-0.1.90.0-windows-x64.zip)
* [Windows x86](https://nimlothrelease.blob.core.windows.net/sindarinrelease/Sindarin-0.1.90.0-windows-x86.zip)
* [Windows ARM64](https://nimlothrelease.blob.core.windows.net/sindarinrelease/Sindarin-0.1.90.0-windows-arm64.zip)
* [Linux x64](https://nimlothrelease.blob.core.windows.net/sindarinrelease/Sindarin-0.1.90.0-linux-x64.zip)
* [macOS x64](https://nimlothrelease.blob.core.windows.net/sindarinrelease/Sindarin-0.1.90.0-macos-x64.zip)

Unzip the downloaded file into the default folder (or into the folder you configured in `sindarin.executablePath`). On Linux, the program was tested only on the Ubuntu distribution.

The always-current release manifest is published at [version.json](https://nimlothrelease.blob.core.windows.net/sindarinrelease/version.json) — the extension's **Update** command uses it to keep Sindarin up to date automatically, so you normally only need to download manually for the first install.

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
    * Crystals size distribuction
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

At the moment Sindarin calcule **X-Ray Powder Diffraction** Pattern

More information about Sindarin can be found in site: [https://sindarinapp.wordpress.com/](https://sindarinapp.wordpress.com/)

**Have a Good Work!**
