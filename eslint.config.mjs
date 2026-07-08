import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importXPlugin from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const reactFiles = ['src/**/*.{js,jsx}', 'server/**/*.js'];

export default [
  { ignores: ['build/', 'dist/', 'node_modules/', 'coverage/'] },

  // @eslint-react (replaces eslint-plugin-react; supports ESLint 10)
  { files: reactFiles, ...eslintReact.configs['recommended-typescript'] },
  { files: reactFiles, ...eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'] },
  {
    files: reactFiles,
    rules: {
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/naming-convention-ref-name': 'off',
      '@eslint-react/use-state': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/web-api-no-leaked-timeout': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/no-forward-ref': 'off',
    },
  },

  // Shared plugins/rules for src + server
  {
    files: reactFiles,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'import-x': importXPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooksPlugin.configs.flat['recommended-latest'].rules,
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      ...importXPlugin.flatConfigs.recommended.rules,
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
      // eslint-plugin-react-hooks v7 recommended-latest adds rules that
      // require a wider codebase pass. Disable here to keep the plugin
      // bump scoped; adopt them in follow-up work.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/error-boundaries': 'off',
    },
  },

  // src — browser globals
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        globalThis: 'readonly',
      },
    },
  },

  // server — Node.js globals + build-time injected constants
  {
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        GIT_TAG: 'readonly',
        GIT_COMMIT: 'readonly',
      },
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
