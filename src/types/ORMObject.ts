import { EntityManager, getManager, UpdateResult } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
export class ORMObject<T> {
  constructor(init?: Partial<T>) {
    if (!init) {
      return;
    }

    Object.keys(init).forEach(key => {
      // @ts-ignore
      this[key] = init[key];
    });
  }


  // Overload this method if any items in data need to be handled specially
  public async updateWith(
    data: QueryDeepPartialEntity<T>,
    entityManager?: EntityManager
  ): Promise<T> {
    const manager = entityManager ? entityManager : getManager();


    const id = (this as any).id as string;
    if (!id) {
      throw new ApolloError('BUG: ORMObject.updateWith called on object with no ID');
    }

    await manager.update(this.constructor.name, { id }, data);
    return manager.findOneOrFail<T>(this.constructor.name, id);
  }

  public async fastUpdate(
    data: QueryDeepPartialEntity<T>,
    entityManager?: EntityManager
  ): Promise<UpdateResult> {
    const id = (this as any).id as string;
    if (!id) {
      throw new ApolloError('BUG: ORMObject.updateWith called on object with no ID');
    }

    const manager = entityManager ? entityManager : getManager();
    return manager.update(this.constructor.name, { id }, data);
  }

  public async save(entityManager?: EntityManager): Promise<T> {
    const manager = entityManager ? entityManager : getManager();


    return manager.save((this as unknown) as T);
  }

  public async delete(entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ? entityManager : getManager();
    await manager.delete(this.constructor.name, { id: (this as any).id });
  }
}
