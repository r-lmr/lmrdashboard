/**
 * Stores a framework logger in the logger member variable
 */
export abstract class AbstractLogger {
  abstract log(moduleString: string, level: LogLevel, msg: string, error?: Error, additionalProperties?: AdditionalLogProperties): void;
}

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly"
}

export type AdditionalLogProperties = Record<string, unknown>;
