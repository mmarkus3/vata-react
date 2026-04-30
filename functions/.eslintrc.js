module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    'quotes': 'off',
    '@typescript-eslint/quotes': ['warn', 'single'],
    'import/no-unresolved': 0,
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['error', 140],
    'indent': 'off',
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/no-unused-vars': [
      'warn', // or 'error'
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }
    ],
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'enums': 'always-multiline',
        'generics': 'always-multiline',
        'tuples': 'always-multiline',
        'functions': 'always-multiline',
        'imports': 'ignore',
        'exports': 'ignore',
      }
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'new-cap': 'off',
    'require-jsdoc': 'off',
  },
};
