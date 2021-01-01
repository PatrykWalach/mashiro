/*eslint-disable @typescript-eslint/no-var-requires*/

const { readFileSync } = require('fs')
const schemaString = `directive @connection(key: String, filter: [String!]) on FIELD
${readFileSync('./schema.graphql', { encoding: 'utf-8' })}`

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
    // '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaString,
        // schemaJson:
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
  ],
}
