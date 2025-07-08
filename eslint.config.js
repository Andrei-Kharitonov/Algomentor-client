import js from '@eslint/js';
import css from '@eslint/css';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'semi': ['error', 'always', { 'omitLastInOneLineBlock': true, 'omitLastInOneLineClassBody': true }],
      'no-extra-semi': 'error',
      'semi-spacing': ['error', { 'before': false, 'after': true }],
      'semi-style': ['error', 'last'],
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0, 'maxBOF': 0 }],
      'indent': ['error', 2], // tab size
      'quotes': ['error', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'no-console': 'warn'
    }
  },
  {
    files: ['**/*.{css,scss}'],
    plugins: {
      css,
    },
    language: 'css/css',
    rules: {
      'css/no-duplicate-imports': 'error',
      'css/no-empty-blocks': 'error',
      'css/no-invalid-at-rules': 'error',
      'css/no-invalid-properties': 'error',
    },
  },
]);