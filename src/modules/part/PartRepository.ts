import {
  DeleteResult,
  EntityRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import {
  Part,
  NewPartInput,
  PartIdsInput,
  PartFilterInput,
  Parts,
} from "./entities/Part";
import { ApolloError } from "apollo-server-errors";
import { OrderDirection } from "../user/entities/UserFilter";
import { queryWithPagination } from "../../utils/pagination";

type T = Part;

class MySelectQueryBuilder extends SelectQueryBuilder<T> {}

@EntityRepository(Part)
export class PartRepository extends Repository<T> {
  public createQueryBuilder(
    _alias?: string,
    queryRunner?: QueryRunner
  ): MySelectQueryBuilder {
    return new MySelectQueryBuilder(
      super.createQueryBuilder("part", queryRunner)
    );
  }

  public async getParts(data: PartFilterInput): Promise<Parts> {
    let query = this.createQueryBuilder().where(
      "part.certificateType = :certificateType",
      { certificateType: data.certificateType }
    );
    if (data.skillType) {
      query = query.andWhere("part.skillType = :skillType", {
        skillType: data.skillType,
      });
    }

    if (data.partIds?.ids && data.partIds?.ids.length > 0) {
      const ids = data.partIds.ids;
      query = query.andWhere(`part.id NOT IN (:ids)`, { ids : ids.map(id => id) });
    }
    // response ordering rules
    const orderDirection = data.orderDirection || OrderDirection.Desc;
    const { newQuery, total, nextCursor } = await queryWithPagination(
      query,
      {
        orderBy: "displayOrder",
        orderDir: orderDirection,
      },
      data.cursor
    );

    const { entities: parts } = await newQuery.getRawAndEntities();
    return {
      parts,
      total,
      nextCursor,
    };
  }
  public async createPart(data: NewPartInput): Promise<Part> {
    const part = new Part(data);
    await part.save();
    return part;
  }
  public async getPartsFromIds(data: PartIdsInput): Promise<Part[]> {
    const ids = data.ids;
    return this.createQueryBuilder()
      .where(`id IN (:ids)`, { ids : ids.map(id => id) })
      .getMany();
  }
  public async updatePart(data: NewPartInput): Promise<Part> {
    const part = await this.findOne(data.id);
    if (!part) {
      throw new ApolloError(`No eWebinar found`, "NOT_FOUND");
    }
    part.updateWith({ ...data });
    return part;
  }

  public async removePart(id: string): Promise<DeleteResult>{
    const res = await this.createQueryBuilder()
      .where("id = :id", { id })
      .delete()
      .execute();
    return res;
  }
}
