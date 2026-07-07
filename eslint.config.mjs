import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importXPlugin from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  { ignores: ['build/', 'dist/', 'node_modules/', 'coverage/'] },

  // src JS/JSX
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        globalThis: 'readonly',
      },
    },
    settings: {
      react: { version: '19.0.0' },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'import-x': importXPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooksPlugin.configs['recommended-latest'].rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...importXPlugin.flatConfigs.recommended.rules,
      // Preserved overrides from .eslintrc.json
      'react/no-unused-prop-types': ['warn', { skipShapeProps: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'array-bracket-spacing': ['warn', 'never'],
      'max-len': ['warn', { code: 120 }],
      'no-plusplus': 'error',
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'object-curly-spacing': ['warn', 'always'],
      'import-x/named': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // server — Node.js globals + build-time injected constants
  {
    files: ['server/**/*.js'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        GIT_TAG: 'readonly',
        GIT_COMMIT: 'readonly',
      },
    },
    settings: {
      react: { version: '19.0.0' },
    },
  },

  // test files — vitest globals
  {
    files: [
      'src/**/*.{test,spec}.{js,jsx}',
      'src/**/__tests__/**/*.{js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        vi: 'readonly',
      },
    },
  },

  // Files using CommonJS require() — SSR-safe leaflet loading + test bootstrap
  {
    files: ['src/views/MapView/**/*.js', 'src/setupTests.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
      },
    },
  },

  // serviceWorker — dead CRA scaffolding not currently imported anywhere;
  // process.env is the CRA-era pattern preserved for potential reactivation.
  {
    files: ['src/serviceWorker.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
];
