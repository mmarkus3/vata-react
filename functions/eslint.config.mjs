import eslint from "@eslint/js";
import preferArrow from "eslint-plugin-prefer-arrow";
import globals from "globals";

import tseslint, { parser } from "typescript-eslint";

export default tseslint.config({
  ignores: [
        "dist/**",
        "**/commitlint.config.cjs",
        "**/eslint.config.mjs",
        "**/vitest.config.mts",
        "**/.puppeteerrc.cjs",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
        globals: {
            ...globals.node,
        },
        parser,
        ecmaVersion: 2022,
        sourceType: "module",
        parserOptions: {
            project: "./tsconfig.lint.json",
        },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-call": ["off"],
      "@typescript-eslint/no-unsafe-assignment": ["off"],
      "@typescript-eslint/no-unsafe-member-access": ["off"],
      "@typescript-eslint/no-unsafe-return": ["off"],
      "@typescript-eslint/no-unsafe-argument": ["off"],
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
            selector: "default",
            format: null,
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", {
        vars: "all",
        varsIgnorePattern: "",
        args: "after-used",
        argsIgnorePattern: "^_",
        caughtErrors: "none",
        caughtErrorsIgnorePattern: "",
        ignoreRestSiblings: false,
      }],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    ignores: ["src/fixtures/**", "dist/**"],
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      preferArrow,
    },
    rules: {

    },
  }
);
