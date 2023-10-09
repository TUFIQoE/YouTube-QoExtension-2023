/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"], // only testing on *.test.ts
    //moduleDirectories: ['node_modules', '<rootDir>']
    setupFiles: ["./jest.setup.js"],
    detectOpenHandles: true,
    globalSetup: "./src/test/config/setup.ts",
    globalTeardown: "./src/test/config/teardown.ts"
};