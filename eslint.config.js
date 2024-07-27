import adonisPlugin from '@adonisjs/eslint-plugin'
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  stylistic: {
    overrides: {
      'style/array-bracket-newline': ['error', { multiline: true }],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/max-statements-per-line': ['error', { max: 2 }],
    },
  },
  typescript: {
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
    },
    overrides: {
      'ts/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      'ts/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
    },
  },
  plugins: {
    adonis: adonisPlugin,
  },
  rules: {
    'node/prefer-global/process': 'off',

    'unicorn/prefer-module': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/filename-case': ['error', { case: 'snakeCase' }],
    'unicorn/no-await-expression-member': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/prefer-number-properties': 'error',

    'antfu/if-newline': 'off',

    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'groups': [
          ['external'],
          [
            'parent',
            'internal',
            'builtin',
            'sibling',
            'index',
          ],
          'object',
          'type',
        ],
        'pathGroups': [
          {
            pattern: '#/**',
            group: 'internal',
            position: 'after',
          },
        ],
        'alphabetize': { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    'adonis/prefer-lazy-controller-import': 'error',
    'adonis/prefer-lazy-listener-import': 'error',
  },
  ignores: [
    '*.min.*',
    'dist',
    'LICENSE',
    'output',
    'coverage',
    'temp',
    'public/assets',
    '__snapshots__',
    '!.github',
    '!.vscode',
  ],
})
