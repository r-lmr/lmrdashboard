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
};
export default config;
