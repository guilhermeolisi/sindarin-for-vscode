# sindarin-for-vscode: extensao do VS Code para o Sindarin

Extensao `sindarincorp.sindarin-lang` do Marketplace: realce de sintaxe dos arquivos `.sin` e seis
comandos que rodam a CLI do Sindarin sobre o arquivo aberto. TypeScript, esbuild, sem .NET: nao ha
`.csproj`, o LSP de C# nao a enxerga e o `dotnet` nao a compila. Regras compartilhadas do workspace
(estilo, git, sempre/nunca) em `../CLAUDE.md`.

## Estrutura

- `src/extension.ts`: o codigo inteiro. Localiza o executavel (`sindarin.executablePath`, depois o
  PATH, depois `C:\Sindarin` ou `~/Sindarin`), registra os comandos e dispara a CLI.
- `src/test/extension.test.ts`: teste de integracao, roda dentro de um VS Code baixado pelo
  `@vscode/test-cli`.
- `package.json`: o manifesto da extensao (comandos, atalhos, icones, linguagem, gramatica).
- `grammar/`: SUBMODULO do `sindarin-grammar` (o repositorio irmao `../sindarin-grammar`). NUNCA edite
  nada ali: a gramatica muda so no `sindarin-grammar`, e aqui so o ponteiro avanca
  (`git -C sindarin-for-vscode/grammar fetch origin`, `merge --ff-only origin/main`, depois
  `git -C sindarin-for-vscode add grammar` e commit). `git submodule status` sem prefixo `+`.
- `resources/`: icones e imagens que VAO no pacote. `Images/`: as fontes dos icones (CorelDRAW `.cdr`
  e os SVG de trabalho), fora do pacote pelo `.vscodeignore`.

## Contrato com o motor

A extensao so conhece o Sindarin pela linha de comando (`buildArgs` em `src/extension.ts`):

| Comando | Argumentos |
|---|---|
| Interpret, Walk, Telchar | `<arquivo> --interpret` / `--walk` / `--telchar`, mais `--all --code` |
| Telchar (no instrument) | `<arquivo> --telchar --no-instrument --all --code` |
| Update | `--update --code` |
| Manual | `--manual` |

Flag renomeada ou removida no `Sindarin` quebra a extensao sem erro de compilacao em lugar nenhum:
quem muda a CLI confere esta tabela.

## Comandos

Da raiz do workspace, sem `cd`:

- Dependencias (uma vez, e quando o `package-lock.json` mudar): `npm --prefix sindarin-for-vscode ci`
- Verificacao completa: `npm --prefix sindarin-for-vscode test`. O `pretest` ja roda `tsc`, o ESLint e o
  bundle; depois o `vscode-test` abre um VS Code de teste (baixado em `.vscode-test/` na primeira vez).
- So tipos ou so lint: `npm --prefix sindarin-for-vscode run check-types` e `run lint`.
- Pacote local: `npm --prefix sindarin-for-vscode run package-vsix`.

O portao `.claude/hooks/testes-afetados.ps1` imprime esses comandos no bloco `FORA DO .NET` quando o
diff toca este repositorio.

Se `check-types` ou `lint` falharem por faltar a pasta `bin/` em `node_modules` (ja aconteceu), rode
`npm ci` de novo antes de procurar erro no codigo.

## Publicacao

O workflow `.github/workflows/publish.yml` publica no Marketplace quando recebe uma tag `v*` (ou pelo
"Run workflow"), e exige que a tag seja igual ao `version` do `package.json`. O push do `master` nao
publica nada. NUNCA crie ou envie tag `v*`, nem rode `publish:vsce`, sem pedido expresso do usuario:
publicar e irreversivel.

## Icones dos comandos

`resources/command*16pxmono.{svg,png}`: 16x16, monocromaticos, cor `#BDBFC1`. A composicao e o "anel de
difracao" (tres paths longos, os mesmos do `commandWalk16pxmono.svg`) com um glifo central proprio. O
glifo vem das geometrias `StreamGeometry x:Key="icon_*"` do Nimloth, em
`../Nimloth/src/Avalonia UI/Styles/BaseDictionary.axaml` (sintaxe de path do SVG; `F0` e evenodd, `F1` e
nonzero), e costuma caber com `transform="translate(3.2,3.4) scale(0.4)"`. O `package.json` aponta para
o `.png`, gerado do SVG (com `sharp`: `density: 288`, depois `resize(16)`).
