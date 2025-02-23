import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default typescriptEslint.config(
	{ ignores: ['*.d.ts', '**/coverage', '**/dist'] },

	{
		extends: [
			eslint.configs.recommended,
			...typescriptEslint.configs.strict,
			...pluginVue.configs['flat/recommended'],
		],

		files: ['**/*.{ts,vue}'],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				parser: typescriptEslint.parser,
				tsconfigRootDir: import.meta.dirname,
			},
		},

		rules: {
			'@typescript-eslint/ban-ts-comment': 'off',

			'vue/attribute-hyphenation': 'off',
			'vue/multi-word-component-names': 'off',
		},
	},

	eslintConfigPrettier
);
