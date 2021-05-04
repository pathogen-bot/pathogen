import {Sql} from 'postgres';
import {BaseStore} from '.';
import {GuildRecord} from '../../models/db/guild';

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

  async update<C extends keyof GuildRecord>(
    id: GuildRecord['id'],
    col: C,
    val: GuildRecord[C]
  ): Promise<GuildRecord> {
    if (col === 'config') {
      const [updated] = await this.sql<GuildRecord[]>`
        UPDATE ${this.sql(this.table)}
          SET config = (
            SELECT config
            FROM ${this.sql(this.table)}
            WHERE id = ${id}
          ) || ${this.sql.json(val)}
          WHERE id = ${id}
          RETURNING *
      `;

      return updated;
    } else {
      // TODO: is this safe?
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
