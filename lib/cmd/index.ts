import {Message, Collection} from 'discord.js-light';
import {createSetDecorator} from '../util';
import {ArgOptions} from './args/validation';
import {_Guard} from './guards';

export abstract class Command {
  constructor(readonly location: string) {}
  /**
   * The name a command is primarily identified and indexed by.
   */
  abstract name: string;

  /**
   * Alternate identifiers for the command
   */
  aliases?: string[];

  /**
   * The main function that makes the command work!
   */
  abstract run(msg: Message): Promise<void>;

  reload() {
    // TODO
  }
}

export interface Command {
  /**
   * Guards are checks that run before a command is executed.
   *
   * In the case of sub-commands A -> B -> C, all of command A's guards must
   * successfully execute before moving to B, and all of B's guards must
   * be successful before moving to C.
   *
   * These are usually set with the `@Guard()` decorator or special guards like
   * `@Admin` or `@Disabled`.
   *
   * Custom guards can be created by extending the `_Guard` class and passing the
   * non-instantiated class to the `@Guard()` decorator.
   *
   * @example ```ts
   * \@Admin
   * \@Guard(MyGuard)
   * class MyCommand extends Command {}
   * ```
   */
  guards?: Set<typeof _Guard>;
  /**
   * Subcommands are a way of grouping similar commands together
   *
   * A subcommand is used like so: `{prefix} command subcommand1 subcommand2 ...`
   *
   * Subcommands can be added with the `@SubCommand` decorator, and can be used with
   * guards and work exactly the same as any other command class.
   *
   * @example ```ts
   * \@Guard(ServerModerator)
   * class ConfigPrefix extends Command {...}
   *
   * \@Guard(ServerModerator)
   * \@SubCommand(ConfigPrefix)
   * class ConfigCommand extends Command {...}
   * ```
   */
  subCommands?: Set<typeof Command>;

  /**
   * The expected arguments a command takes. Providing a `kind` option will transform the arg
   * to the correct type and wil rase an error if it is unable to do so.
   *
   * This can be used with the `@Arg` decorator
   *
   * @example ```ts
   * import Joi from 'joi';
   *
   * \@Arg({
   *   name: 'uintArg',
   *   kind: ArgKind.UINT,
   *   validate: Joi.number().min(0).max(400),
   * })
   * ```
   */
  argSchema: ArgOptions<unknown>[];
}

export class CommandRegistry extends Collection<string, Command> {
  constructor() {
    super();
  }

  /**
   * Register a command
   */
  register<T extends Command>(c: T): this {
    this.set(c.name, c);
    return this;
  }

  /**
   * Find a top-level command by its name or one of its aliases
   */
  get(c: string): Command | undefined {
    return this.find(({name, aliases}) => name === c || !!aliases?.includes(c));
  }
}

/**
 * Adds a command as a subcommand of another command
 */
export const SubCommand = createSetDecorator<typeof Command>('subCommands');

export * from './guards';
export * from './args';
