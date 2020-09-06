import { EntityRepository, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';

// import { ApolloError } from 'apollo-server-express';
import { Part, NewPartInput } from './entities/Part';
import { ApolloError } from 'apollo-server-errors';


type T = Part;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {
}

@EntityRepository(Part)
export class PartRepository extends Repository<T> {
  public createQueryBuilder(_alias?: string, queryRunner?: QueryRunner): MySelectQueryBuilder {
    return new MySelectQueryBuilder(super.createQueryBuilder('part', queryRunner));
  }

  public async createPart(data: NewPartInput): Promise<Part>{
    const part = new Part(data);
    await part.save();
    return part;
  }
  public async updatePart(data: NewPartInput): Promise<Part>{
    const part = await this.findOne(data.id);
    if(!part){
        throw new ApolloError(`No eWebinar found`, 'NOT_FOUND');
    }
    part.updateWith({...data});
    return part;
  }
}
