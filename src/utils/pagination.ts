
import { SelectQueryBuilder } from 'typeorm';
import config from '../config';
import { OrderDirection } from '../modules/user/entities/UserFilter';



export interface PaginationCursorInterface {
  limit: number;
  offset: number;
  orderBy: string;
  orderDir: OrderDirection;
  toString(): string;
}

export class PaginationCursor implements PaginationCursorInterface {
  public limit = Number(config.PAGINATION_LIMIT) || 10;
  public offset = 0;
  public orderBy = 'id';
  public orderDir = OrderDirection.Asc;

  public constructor(value?: string) {
    if (value) {
      const data = PaginationCursor.toObject(value);
      this.limit = data.limit ?? this.limit;
      this.offset = data.offset ?? this.offset;
      this.orderBy = data.orderBy ?? this.orderBy;
      this.orderDir = data.orderDir ?? this.orderDir;
    }
  }

  public toString(): string {
    return btoa(JSON.stringify(this));
  }

  public nextCursor(): PaginationCursor {
    this.offset += this.limit;
    return this;
  }

  public static toObject(value: string): PaginationCursor {
    return JSON.parse(atob(value)) as PaginationCursor;
  }

  public static validate(cursor: string, orderBy: string, orderDir: OrderDirection): boolean {
    const cursorObj = PaginationCursor.toObject(cursor);
    return cursorObj.orderBy === orderBy && cursorObj.orderDir === orderDir;
  }
}

export interface QueryWithPaginationCursor<T> {
  newQuery: SelectQueryBuilder<T>;
  total: number;
  nextCursor?: string;
}

export function atob(value: string): string {
  return Buffer.from(value, 'base64').toString();
}

export function btoa(value: string): string {
  return Buffer.from(value).toString('base64');
}

export async function queryWithPagination<T>(
  query: SelectQueryBuilder<T>,
  params: {
    orderBy: string;
    orderDir: OrderDirection;
    limit?: number;
  },
  cursor?: string,
  skipTotalCheck?: boolean
): Promise<QueryWithPaginationCursor<T>> {
  let cursorObj: PaginationCursor = new PaginationCursor(btoa(JSON.stringify(params)));
  if (cursor && PaginationCursor.validate(cursor, params.orderBy, params.orderDir)) {
    cursorObj = new PaginationCursor(cursor);
  }

  query = query.addOrderBy(
    cursorObj.orderBy,
    cursorObj.orderDir === OrderDirection.Asc ? 'ASC' : 'DESC'
  );

  const total: number = await query.getCount();
  query = query.take(cursorObj.limit).skip(cursorObj.offset);
  const hasNextCursor = async (c: number, cur: PaginationCursorInterface): Promise<boolean> => {
    if (c <= cur.limit) {
      return false;
    }
    const offsetCount = await query.getMany();
    if (skipTotalCheck && offsetCount.length > 0) {
      return true;
    }
    if (c === offsetCount.length + cur.offset) {
      return false;
    }
    return offsetCount.length === cur.limit;
  };
  return {
    newQuery: query,
    total,
    nextCursor: (await hasNextCursor(total, cursorObj)) ? cursorObj.nextCursor().toString() : '',
  };
}
