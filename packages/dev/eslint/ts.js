import { defineConfig } from 'eslint/config';
import tsLint from 'typescript-eslint';
import js from './js.js';

export default defineConfig([
  ...js,
  {
    extends: [tsLint.configs.recommendedTypeChecked],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsLint.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
