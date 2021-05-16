import {GuildStore} from './store/guild';
import postgres, {Options as ConnectionOptions, Sql} from 'postgres';

export class Database {
  public readonly guilds: GuildStore;
  protected sql: Sql<Record<string, unknown>>;

  constructor(url: string, options?: ConnectionOptions<{}>) {
    const pool = postgres(url, options);

    this.sql = pool;

    this.guilds = new GuildStore(pool);
  }

  /* istanbul ignore next */
  end() {
    return this.sql.end();
  }
}

export * from './store';
