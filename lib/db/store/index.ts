import {Sql} from 'postgres';
import {DatabaseRecord} from 'pathogen';

export * from './guild';

export abstract class BaseStore<T extends DatabaseRecord<unknown>> {
  protected abstract table: string;

  constructor(protected pool: Sql<Record<string, unknown>>) {}

  /**
   * Insert a row into the database
   * @param row The data to insert
   * @returns The complete database row
   */
  abstract add(row: Omit<T, 'id'> & {id?: T['id']}): Promise<T>;

  /**
   * Get a single row from the database
   * @param id The ID of the row to select
   * @returns The selected row
   */
  abstract get(id: T['id']): Promise<T | null>;

  /**
   * Delete a row from the database
   * @param id The ID of the row to delete
   * @returns The deleted row
   */
  abstract remove(id: T['id']): Promise<T | null>;

  /**
   * Update a single value in the table
   * @param id The ID of the row to update
   * @param col The column name
   * @param val The new value
   * @returns The modified row
   */
  abstract update<C extends keyof T>(
    id: T['id'],
    col: C,
    val: T[C]
  ): Promise<T>;
}
