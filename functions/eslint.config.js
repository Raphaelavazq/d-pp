export default [
  {
    files: ["src/**/*.js"],
    ignores: ["lib/**/*", "node_modules/**/*", "src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
];
