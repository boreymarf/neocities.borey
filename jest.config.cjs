/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    //"^.+.tsx?$": ["ts-jest", {}],
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@managers/(.*)$": "<rootDir>/src/lib/managers/$1",
    "^@/(.*)$": "<rootDir>/$1"
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};
