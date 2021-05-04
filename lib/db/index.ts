import {GuildStore} from './store/guild';
import postgres, {Options as ConnectionOptions} from 'postgres';

export class Database {
  public readonly guilds: GuildStore;

  constructor(url: string, options?: ConnectionOptions<{}>) {
    const pool = postgres(url, options);

    this.guilds = new GuildStore(pool);
  }
}

export * from './store';
