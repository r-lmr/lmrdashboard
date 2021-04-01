import winston from 'winston';
import { AbstractLogger, AdditionalLogProperties, LogLevel } from './AbstractLogger';

/**
 * Uses the winston logging framework
 */
export class WinstonLogger extends AbstractLogger {
  private readonly logger: winston.Logger;

  constructor(logger: winston.Logger) {
    super();
    this.logger = logger;
  }

  public log(moduleString: string, level: LogLevel, msg: string, error?: Error, additionalProperties?: AdditionalLogProperties): void {
    this.logger.log(level, msg, error, {
      module: moduleString,
      additionalProperties
    });
  }
}
