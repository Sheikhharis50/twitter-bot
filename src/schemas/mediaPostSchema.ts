import { pgTable, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const mediaPostStatusEnum = pgEnum('mediaPostStatus', ['new', 'posted']);

export type IMediaPostStatus =
  (typeof mediaPostStatusEnum)['enumValues'][number];

export const mediaPostSchema = pgTable('media_posts', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  status: mediaPostStatusEnum().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata'),
});

export type IMediaPostTable = typeof mediaPostSchema;
