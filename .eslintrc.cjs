module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "eslint:recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": "warn",
    "no-constant-condition": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "warn",
  },
};
