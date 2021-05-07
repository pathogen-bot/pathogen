import {Database} from 'pathogen';

const dbUrl =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@db/pathogen';

describe('DATABASE', () => {
  it('successfully connect to the database', () => {
    new Database(dbUrl);
  });
});
