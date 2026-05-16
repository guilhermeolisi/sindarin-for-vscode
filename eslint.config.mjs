import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['out', 'dist', '**/*.d.ts', 'esbuild.js'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.ts'],
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				{ selector: 'import', format: ['camelCase', 'PascalCase'] },
			],
			curly: 'warn',
			eqeqeq: 'warn',
			'no-throw-literal': 'warn',
			semi: 'warn',
		},
	},
);
