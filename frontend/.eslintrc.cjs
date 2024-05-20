module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["./tsconfig.json"]
    },
    plugins: ["react-refresh", "@typescript-eslint"],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
        "linebreak-style": 0,
        "object-curly-spacing": "off",
        "new-cap": "error",
        "no-unused-vars": "off",
        "require-jsdoc": "error",
        "@typescript-eslint/semi": ["error"],
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/restrict-template-expressions": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" },
        ],
        "no-case-declarations": "off",
        indent: ["error", 4],
        "max-len": [
            "warn",
            {
                ignoreTemplateLiterals: true,
                ignoreStrings: true,
            },
        ],
    },
};
