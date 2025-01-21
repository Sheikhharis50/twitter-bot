import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { configs } from '../configs';

export abstract class BaseRepository<TTable extends PgTableWithColumns<any>> {
  public db: NeonHttpDatabase;
  abstract table: TTable;
  abstract tableName: string;

  constructor() {
    const sql = neon(configs.database_url);
    this.db = drizzle({ client: sql });
  }
}
