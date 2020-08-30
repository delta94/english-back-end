import { EntityManager, getManager, UpdateResult } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AssetRepository } from '../modules/assets/AssetRepository';

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

  protected async makeDraftMediaPermanent(orig: any | null, data: any): Promise<any> {
    const assetRepository = getManager().getCustomRepository(AssetRepository);

    for (const prop in data) {
      if (data.hasOwnProperty && data.hasOwnProperty(prop)) {
        if (prop.endsWith('MediaUrl') && data[prop] && data[prop].includes('-draft')) {
          const origUrl = orig ? (orig[prop] as string) : undefined;
          const draftUrl = data[prop] as string;
          const newUrl = await assetRepository.makeAssetPermanent(draftUrl, origUrl);

          // Rename property coming in to new neame
          data[prop] = newUrl;
          continue;
        }

        if (typeof data[prop] === 'object') {
          // Recurse
          data[prop] = await this.makeDraftMediaPermanent(orig ? orig[prop] : null, data[prop]);
        }
      }
    }

    return data;
  }

  // Overload this method if any items in data need to be handled specially
  public async updateWith(
    data: QueryDeepPartialEntity<T>,
    entityManager?: EntityManager
  ): Promise<T> {
    const manager = entityManager ? entityManager : getManager();

    await this.makeDraftMediaPermanent(this, data);

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

    // Modifies this in-place
    await this.makeDraftMediaPermanent(null, this);

    return manager.save((this as unknown) as T);
  }

  public async delete(entityManager?: EntityManager): Promise<void> {
    const manager = entityManager ? entityManager : getManager();
    await manager.delete(this.constructor.name, { id: (this as any).id });
  }
}
