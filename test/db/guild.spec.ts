/* eslint node/no-unpublished-import: 0 */

import {assert, expect} from 'chai';
import {GuildConfig, GuildRecord, GuildStore} from 'pathogen';
import postgres from 'postgres';

const sql = postgres(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@db/pathogen'
);
const store = new GuildStore(sql);

describe('GUILD STORE', () => {
  before(async () => {
    await sql`CREATE TEMPORARY TABLE guilds (LIKE guilds INCLUDING ALL)`;
  });

  describe('#add()', () => {
    it('successfully insert a row', async () => {
      const config: GuildRecord = {
        id: '1',
        blocked: false,
        config: {prefix: '~'},
      };

      const result = await store.add(config);

      expect(result).to.deep.equal(config);
    });

    it('unsuccessfully insert a duplicate row', async () => {
      const config: GuildRecord = {
        id: '1',
        blocked: false,
        config: {prefix: '~'},
      };

      try {
        await store.add(config);
        assert.fail('Inserted duplicate row');
      } catch (e) {
        expect(e.name).to.eq('PostgresError');
        expect(e).to.satisfy((e: Error) =>
          e.message.startsWith('duplicate key value violates unique constraint')
        );
      }
    });
  });

  describe('#get()', () => {
    it('successfully select a row from the guilds table', async () => {
      const res = await store.get('1');
      expect(res).to.deep.include({
        id: '1',
        blocked: false,
        config: {prefix: '~'},
      });
    });

    it('unsuccessfully select a non-existant row from the guilds table', async () => {
      const found = await store.get('2');
      expect(found).to.be.undefined;
    });
  });

  describe('#update()', () => {
    it('successfully update JSON config column', async () => {
      const config: GuildConfig = {prefix: '??'};

      const updated = await store.update('1', 'config', config);
      expect(updated.config).to.deep.equal(config);
    });

    it('successfully update non-JSON column', async () => {
      const updated = await store.update('1', 'blocked', true);
      expect(updated.blocked).to.equal(true);
    });
  });

  describe('#remove()', () => {
    it('successfully remove a row from the guilds table', async () => {
      const removed = await store.remove('1');
      expect(removed).to.deep.include({
        id: '1',
        blocked: true,
        config: {prefix: '??'},
      });

      const found = await store.get('1');
      expect(found).to.be.undefined;
    });

    it('unsuccessfully remove a non-existant row from the guilds table', async () => {
      const removed = await store.remove('1');
      expect(removed).to.be.undefined;

      const found = await store.get('1');
      expect(found).to.be.undefined;
    });
  });

  after(async () => await sql.end());
});
