module.exports = {
  env: {
    node: true,
    es2023: true,
    browser: true,
  },
  extends: ["eslint:recommended", "plugin:astro/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {},
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
    {
      files: ["*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["react", "@typescript-eslint"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
  ],
};
