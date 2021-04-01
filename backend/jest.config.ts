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
  maxWorkers: 1 // Necessary so the tests don't run in parallel and interfere with files used for assertions
};
export default config;
