import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Flat ESLint configuration.
 *
 * Three layers: correctness (`js` + `typescript-eslint`), React discipline
 * (hooks + fast-refresh), and finally `eslint-config-prettier`, which turns
 * off every stylistic rule so formatting is Prettier's job alone.
 */
export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules', '.vite-source-tags.js']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
    },
    rules: {
      // Unused variables are errors, but an underscore prefix is a documented
      // opt-out for intentionally ignored parameters.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Console noise is a smell in components, but warnings and errors are
      // how this app reports degraded capabilities (no canvas, no clipboard).
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-implicit-coercion': 'warn',
    },
  },

  // Node-side tooling: config files and scripts.
  {
    files: ['*.config.{ts,js}', 'tools/**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },

  // Tests may reach for expressive patterns that are noise in app code.
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
]);
