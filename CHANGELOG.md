# Change Log

All notable changes to the "sindarin-for-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.0]

- Rewrote the extension core: platform detection now uses Node's `os`/`process`
  instead of spawning shell commands, and the Sindarin executable is located by
  checking the filesystem and PATH instead of running the program.
- Fixed a bug where the active document was not actually awaited before running,
  and where `~` paths were not expanded on Linux/macOS.
- Added the `sindarin.executablePath` setting to override the Sindarin location.
- Modernized tooling: TypeScript 5, ESLint 9 (flat config), esbuild bundling,
  `@vscode/test-cli` integration tests, and updated the extension manifest.

## [Unreleased]

- Initial release