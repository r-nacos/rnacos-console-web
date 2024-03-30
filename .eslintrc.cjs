/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['./docs/*.md', './temp/*.ts'],
  // '@vue/eslint-config-prettier' './temp/.eslintrc-auto-import.json'
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['prettier', 'vue'],
  globals: {
    VConsole: true,
    AnyObject: true,
    Res: true,
    APP_INFO: true,
    Bridge: true,
    Logger: true,
    NodeJS: true,
  },
  parser: 'vue-eslint-parser',
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/html-self-closing': 'off',
    'vue/no-parsing-error': [
      0,
      {
        'x-invalid-end-tag': true,
      },
    ],
    'no-irregular-whitespace': 0,
    'no-var': 'error',
    'no-unused-vars': 'off',
    'no-return-assign': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': [
      'warn',
      {
        bracketSpacing: true,
        printWidth: 1000,
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        arrowParens: 'avoid',
        jsxBracketSameLine: true,
        requirePragma: false,
        htmlWhitespaceSensitivity: 'ignore',
        singleAttributePerLine: true,
        vueIndentScriptAndStyle: false,
        endOfLine: 'auto',
        quoteProps: 'as-needed',
        proseWrap: 'never',
      },
    ],
  },
}
