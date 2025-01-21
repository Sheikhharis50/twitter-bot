import { and, asc, SQLWrapper } from 'drizzle-orm';
import { IMediaPostTable, mediaPostSchema } from '../schemas';
import { BaseRepository } from './_base';

export type IMediaPost = IMediaPostTable['$inferSelect'];

export class MediaPostRepository extends BaseRepository<IMediaPostTable> {
  table = mediaPostSchema;
  tableName: string = 'media_posts';

  async findBy({
    filters = [],
  }: {
    filters?: SQLWrapper[];
  }): Promise<IMediaPost[]> {
    return this.db
      .select()
      .from(this.table)
      .where(and(...filters))
      .orderBy(asc(this.table.id));
  }

  async update({
    set,
    filters = [],
  }: {
    set: Partial<IMediaPost>;
    filters?: SQLWrapper[];
  }): Promise<IMediaPost[]> {
    return this.db
      .update(this.table)
      .set(set)
      .where(and(...filters))
      .returning();
  }
}
