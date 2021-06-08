import path from "path";
import { AbstractLogger, AdditionalLogProperties, LogLevel } from "./AbstractLogger";
import { SingletonLogProvider } from "./LogProvider";

/**
 * Class used to initialize a logger with additional properties for subsequent log calls.
 * The same singleton logger instance is used on each class construction, but calls to the
 * logging methods are overwritten with additional information.
 */
export class LogWrapper {

  private readonly logger: AbstractLogger;
  private readonly module: string;

  constructor(filePath: string) {
    this.module = this.getModuleNameFromPath(filePath);
    this.logger = SingletonLogProvider.Instance.getLogger();
  }

  private getModuleNameFromPath(filePath: string): string {
    return path.basename(filePath)
  }

  private log(level: LogLevel, msg: string, error?: Error, additionalProperties?: AdditionalLogProperties): void {
    this.logger.log(this.module, level, msg, error, additionalProperties);
  }

  public error(msg: string, error?: Error, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.ERROR, msg, error, additionalProperties);
  }

  public warn(msg: string, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.WARN, msg, undefined, additionalProperties);
  }

  public info(msg: string, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.INFO, msg, undefined, additionalProperties);
  }

  public verbose(msg: string, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.VERBOSE, msg, undefined, additionalProperties);
  }

  public debug(msg: string, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.DEBUG, msg, undefined, additionalProperties);
  }

  public silly(msg: string, additionalProperties?: AdditionalLogProperties): void {
    this.log(LogLevel.SILLY, msg, undefined, additionalProperties);
  }
}
