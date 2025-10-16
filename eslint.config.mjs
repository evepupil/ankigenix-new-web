import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // 将 any 从 error 降级为 warning
      "@typescript-eslint/no-unused-vars": "warn",  // 未使用变量降级为 warning
      "react-hooks/exhaustive-deps": "warn",       // Hook 依赖警告降级
    },
  },
];

export default eslintConfig;
