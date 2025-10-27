import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Converts module URL to path values
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Compatibility layer for extending older ESLint config syntax (extends)
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define ESLint configuration
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-sync-scripts": "off",
    },
  },
];

export default eslintConfig;
