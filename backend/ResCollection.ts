import { Response } from 'express-serve-static-core';

class ResCollection {

  private collection: Map<string, Response<any, number>>;
  private static _instance: ResCollection;

  constructor() {
    this.collection = new Map();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getCollectionSize(): number {
    return this.collection.size;
  }

  public getEntryFromCollection(id: string): Response<any, number> | undefined {
    if (!this.collection.has(id)) {
      console.error('Response not found in Response collection when trying to get')
    }
    return this.collection.get(id);
  }

  public addToCollection(id: string, res: Response<any, number>) {
    console.log(`Adding res to collection of size ${this.collection.size}`)
    this.collection.set(id, res);
  }

  public removeFromCollection(id: string) {
    console.log(`Removing res from collection of size ${this.collection.size}`)
    if (!this.collection.has(id)) {
      console.warn('Response not found in Response collection when trying to delete')
    }
    this.collection.delete(id);
  }

  public doForAllResInCollection(functionToExecute: (arg: Response<any, number>) => void) {
    this.doMultipleForAllResInCollection([functionToExecute]);
  }

  public doMultipleForAllResInCollection(functionsToExecute: ((arg: Response<any, number>) => void)[]) {
    this.collection.forEach(
      (res: Response<string, number>, resId: string) => {
        for (const functionToExecute of functionsToExecute) {
          functionToExecute(res);
        }
      });
  }

}

export { ResCollection };