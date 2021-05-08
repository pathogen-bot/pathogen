/* eslint node/no-unpublished-import: 0 */

import {expect} from 'chai';
import {Command, CommandRegistry} from 'pathogen';

describe('COMMAND REGISTRY', () => {
  let registry: CommandRegistry;
  it('create registry', () => {
    registry = new CommandRegistry();
  });

  it('add commands', () => {
    const createCommand = (name: string) =>
      class MyCommand extends Command {
        name = name;

        constructor() {
          super('.');
        }

        async run() {}
      };

    const withAliases = new (createCommand('withAliases'))();
    withAliases.aliases = ['alias'];

    registry
      .register(new (createCommand('firstCommand'))())
      .register(new (createCommand('secondCommand'))())
      .register(new (createCommand('thirdCommand'))())
      .register(new (createCommand('fourthCommand'))())
      .register(withAliases);
  });

  it('get commands by name', () => {
    const firstCommand = registry.get('firstCommand');
    const secondCommand = registry.get('secondCommand');
    const thirdCommand = registry.get('thirdCommand');
    const withAliases = registry.get('alias');

    expect(firstCommand?.name).to.equal('firstCommand');
    expect(secondCommand?.name).to.equal('secondCommand');
    expect(thirdCommand?.name).to.equal('thirdCommand');
    expect(withAliases?.name).to.equal('withAliases');
  });
});
