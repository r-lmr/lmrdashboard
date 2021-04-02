import fs from 'fs';
import path from 'path';
import winston, { createLogger, format, transports } from 'winston';
import { AbstractLogger, LogLevel } from './AbstractLogger';
import { WinstonLogger } from './WinstonLogger';

/**
 * Class used to instantiate an AbstractLogger based on a logger framework type.
 */
export class LogCreator {
  public static instantiateAbstractLoggerByType(loggerType: LoggerType, defaultServiceName: string): AbstractLogger {
    if (loggerType === LoggerType.WINSTON) {
      return LogCreator.instantiateWinstonLogger(defaultServiceName);
    }
    throw new Error(`Logger type ${loggerType} not implemented.`);
  }

  /**
   * Winston logging configuration should be done here.
   */
  private static instantiateWinstonLogger(defaultServiceName: string): WinstonLogger {
    const logger: winston.Logger = createLogger({
      level: process.env.LMRD_LOG_LEVEL || LogLevel.DEBUG,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: { service: defaultServiceName },
      transports: [
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        new transports.File({
          filename: path.join(this.getAndCreateLogDir('logs'), `${defaultServiceName}-error.log`),
          level: LogLevel.ERROR,
        }),
        new transports.File({
          filename: path.join(this.getAndCreateLogDir('logs'), `${defaultServiceName}-combined.log`),
        }),
      ],
    });

    // Enable console logging even if in production, could be disabled in theory
    // if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
          format.printf((info: winston.Logform.TransformableInfo) => {
            let rtn = '';
            rtn += '[' + info.level + ']\t';
            rtn += info.timestamp + ': ';
            if (info.stack) {
              rtn += info.module + ': ';
              rtn += info.message.replace(info.stack.split('\n')[0].substr(7), '');
              rtn += '\n';
              rtn += '[' + info.level + '] ';
              rtn += info.stack.replace(/\n/g, `\n[${info.level}]\t`);
            } else {
              rtn += info.module + ': ';
              rtn += info.message + ' ';
            }
            if (info.additionalProperties) {
              rtn += JSON.stringify(info.additionalProperties) + ' ';
            }
            return rtn.trim();
          })
        ),
      })
    );

    return new WinstonLogger(logger);
  }

  private static getAndCreateLogDir(dirName: string): string {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }
    return dirName;
  }
}

export enum LoggerType {
  WINSTON,
}
