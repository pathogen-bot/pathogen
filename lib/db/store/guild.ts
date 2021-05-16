import {Sql} from 'postgres';
import {BaseStore} from '.';
import {GuildRecord} from '../../models/db/guild';
import {DotNotation, DotToPropType} from '../../util';

export class GuildStore extends BaseStore<GuildRecord> {
  protected table = 'guilds';

  constructor(protected sql: Sql<Record<string, unknown>>) {
    super(sql);
  }

  async add(row: GuildRecord): Promise<GuildRecord> {
    const [inserted] = await this.sql<GuildRecord[]>`
      INSERT INTO ${this.sql(this.table)} (id, blocked, config)
      VALUES (${row.id}, ${row.blocked}, ${this.sql.json(row.config)})
      RETURNING *
    `;

    return inserted;
  }

  async get(id: GuildRecord['id']): Promise<GuildRecord> {
    const [selected] = await this.sql<GuildRecord[]>`
      SELECT *
      FROM ${this.sql(this.table)}
      WHERE id = ${id}
    `;

    return selected;
  }

  async remove(id: GuildRecord['id']): Promise<GuildRecord> {
    const [deleted] = await this.sql<GuildRecord[]>`
      DELETE FROM ${this.sql(this.table)}
      WHERE id = ${id}
      RETURNING *
    `;

    return deleted;
  }

  async update<K extends DotNotation<GuildRecord>>(
    id: GuildRecord['id'],
    col: K,
    val: DotToPropType<GuildRecord, K>
  ): Promise<GuildRecord> {
    if (col.startsWith('config.')) {
      const [updated] = await this.sql<GuildRecord[]>`
        UPDATE ${this.sql(this.table)}
        SET config = jsonb_set(config, ${this.sql.array(
          col.split('.').slice(1)
        )}, ${this.sql.json(val)})
        WHERE id = ${id}
        RETURNING *
      `;

      return updated;
    } else {
      const [updated] = await this.sql<GuildRecord[]>`
        UPDATE ${this.sql(this.table)}
        SET ${this.sql(col)} = ${val as string | number | boolean}
        WHERE id = ${id}
        RETURNING *
      `;

      return updated;
    }
  }
}
