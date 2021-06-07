import type { Config } from '@jest/types';
import { defaults } from 'jest-config';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverage: true,
  coverageDirectory: 'results/coverage',
  reporters: ['default', 'jest-junit'],
  testPathIgnorePatterns: ['cypress'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};
export default config;
