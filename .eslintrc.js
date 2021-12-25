module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
	],
	ignorePatterns: ['dist/*'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ argsIgnorePattern: '^_' },
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
