module.exports = {
  roots: ["<rootDir>"],
  transform: {
    ".(ts|tsx)$": require.resolve("ts-jest/dist"),
    ".(js|jsx)$": require.resolve("babel-jest"),
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["packages/**/src/**/*.{ts,tsx}"],
  testMatch: ["<rootDir>/packages/**/src/**/*.(spec|test).{ts,tsx,js,jsx}"],
  testURL: "http://localhost",
  watchPlugins: [
    require.resolve("jest-watch-typeahead/filename"),
    require.resolve("jest-watch-typeahead/testname"),
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts",
    "jest-mock-console/dist/setupTestFramework.js",
  ],
  testEnvironment: "jest-environment-jsdom-sixteen",
};
