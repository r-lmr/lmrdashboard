import { AbstractLogger } from './AbstractLogger';
import { LogCreator, LoggerType } from './LogCreator';

/**
 * Singleton that holds an instance of an AbstractLogger, which is used in the LogWrapper
 */
export class SingletonLogProvider {

  private readonly logger: AbstractLogger;
  private static _instance: SingletonLogProvider;

  private constructor() {
    const defaultServiceName = 'lmrd';
    this.logger = LogCreator.instantiateAbstractLoggerByType(LoggerType.WINSTON, defaultServiceName);
  }

  public static get Instance(): SingletonLogProvider {
    return this._instance || (this._instance = new this());
  }

  public getLogger(): AbstractLogger {
    return this.logger;
  }
}
