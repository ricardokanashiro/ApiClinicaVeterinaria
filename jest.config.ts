import { pathsToModuleNameMapper } from "ts-jest"
import { compilerOptions } from "./tsconfig.json"

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   transform: {
     '^.+\\.ts$': 'ts-jest',
   },
   moduleFileExtensions: ['ts', 'js'],
   testMatch: ['<rootDir>/src/**/*.test.ts'],
   verbose: true,
   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/"
   })
 }