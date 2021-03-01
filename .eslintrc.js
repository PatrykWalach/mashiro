/*eslint-disable @typescript-eslint/no-var-requires*/

const { readFileSync } = require('fs')
const schemaString = readFileSync('./schemas/nexus.graphql', {
  encoding: 'utf-8',
})
const anilistSchemaString = readFileSync('./schemas/anilist.graphql', {
  encoding: 'utf-8',
})

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  plugins: ['graphql'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'graphql/template-strings': [
      'error',
      {
        env: 'literal',
        schemaString,
      },
    ],
    'graphql/named-operations': [
      'warn',
      {
        schemaString,
      },
    ],
    'graphql/required-fields': [
      'error',
      {
        env: 'literal',
        schemaString,
        requiredFields: ['id'],
      },
    ],
    // '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['**/__generated__/*.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['background/dataSources/anilistApi.ts'],
      rules: {
        'graphql/template-strings': [
          'error',
          {
            env: 'literal',
            schemaString: anilistSchemaString,
          },
        ],
        'graphql/named-operations': [
          'warn',
          {
            schemaString: anilistSchemaString,
          },
        ],
        'graphql/required-fields': [
          'error',
          {
            env: 'literal',
            schemaString: anilistSchemaString,
            requiredFields: ['id'],
          },
        ],
      },
    },
  ],
}
