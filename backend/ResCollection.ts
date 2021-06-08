import { Response } from 'express-serve-static-core';
import { LogWrapper } from './utils/logging/LogWrapper';

const log = new LogWrapper(module.id);

/**
 * Singleton that holds the open connections to which to respond
 */
class ResCollection {
  private collection: Map<string, Response<any, number>>;
  private static _instance: ResCollection;

  private constructor() {
    this.collection = new Map();
  }

  public static get Instance(): ResCollection {
    return this._instance || (this._instance = new this());
  }

  public getCollectionSize(): number {
    return this.collection.size;
  }

  public getEntryFromCollection(id: string): Response<any, number> | undefined {
    if (!this.collection.has(id)) {
      console.error('Response not found in Response collection when trying to get');
    }
    return this.collection.get(id);
  }

  public addToCollection(id: string, res: Response<any, number>) {
    log.verbose(`Adding res to collection of size ${this.collection.size}`, { id: id });
    this.collection.set(id, res);
    log.debug('Addition successful');
  }

  public removeFromCollection(id: string): void {
    log.verbose(`Removing res from collection of size ${this.collection.size}`, { id: id });
    if (!this.collection.has(id)) {
      console.warn('Response not found in Response collection when trying to delete');
    }
    this.collection.delete(id);
    log.debug('Removal successful');
  }

  public doForAllResInCollection(functionToExecute: (arg: Response<any, number>, arg2?: string[]) => void) {
    this.doMultipleForAllResInCollection([functionToExecute]);
  }

  public doMultipleForAllResInCollection(functionsToExecute: ((arg: Response<any, number>) => void)[]) {
    log.debug(
      `Calling ${functionsToExecute.length} function(s) for all res in collection of size ${this.getCollectionSize()}`
    );
    this.collection.forEach((res: Response<string, number>) => {
      for (const functionToExecute of functionsToExecute) {
        functionToExecute(res);
      }
    });
  }
}

export { ResCollection };
