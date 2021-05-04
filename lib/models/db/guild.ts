import {DatabaseRecord} from '.';
import {Snowflake} from '..';

export interface GuildRecord extends DatabaseRecord<Snowflake> {
  config: GuildConfig;
  blocked: boolean;
}

export interface GuildConfig {
  prefix?: string;
}
