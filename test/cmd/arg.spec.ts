/* eslint node/no-unpublished-import: 0 */

import {expect} from 'chai';
import {Arg, ArgFormat, Args} from 'pathogen';

describe('ARGUMENT PARSER', () => {
  describe('#parse()', () => {
    it('parse unquoted text', () => {
      const args = new Args('unquoted text');

      expect(args.size).to.equal(2);
      expect(args.nth(0)?.val).to.equal('unquoted');
      expect(args.peek()?.val).to.equal('unquoted');
      expect(args.next()?.val).to.equal('unquoted');
      expect(args.next()?.val).to.equal('text');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('text');
    });

    it('parse single-quoted text', () => {
      const args = new Args("'single-quoted text'");

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('single-quoted text');
      expect(args.peek()?.val).to.equal('single-quoted text');
      expect(args.next()?.val).to.equal('single-quoted text');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('single-quoted text');
    });

    it('parse double-quoted text', () => {
      const args = new Args('"double-quoted text"');

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('double-quoted text');
      expect(args.peek()?.val).to.equal('double-quoted text');
      expect(args.next()?.val).to.equal('double-quoted text');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('double-quoted text');
    });

    it('parse inline code', () => {
      const args = new Args('`inline code`');

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('inline code');
      expect(args.peek()?.val).to.equal('inline code');
      expect(args.next()?.val).to.equal('inline code');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('inline code');
    });

    it('parse a code block without a language', () => {
      const args = new Args('```\ncode block without a lang\n```');

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('code block without a lang');
      expect(args.peek()?.val).to.equal('code block without a lang');
      expect(args.next()?.val).to.equal('code block without a lang');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('code block without a lang');
    });

    it('parse a code block with a language', () => {
      const args = new Args('```ts\ncode block without a lang\n```');

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('code block without a lang');
      expect(args.peek()?.val).to.equal('code block without a lang');
      expect(args.next()?.val).to.equal('code block without a lang');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('code block without a lang');
      expect(args.nth(0).lang).to.equal('ts');
    });

    it('parse a code block with an invalid language', () => {
      const args = new Args('```1ts\ncode block with an invalid lang\n```');

      expect(args.size).to.equal(1);
      expect(args.nth(0)?.val).to.equal('1ts\ncode block with an invalid lang');
      expect(args.peek()?.val).to.equal('1ts\ncode block with an invalid lang');
      expect(args.next()?.val).to.equal('1ts\ncode block with an invalid lang');
      expect(args.next()?.val).to.equal(undefined);
      expect(args.prev()?.val).to.equal('1ts\ncode block with an invalid lang');
    });

    it('parse a mix of quoted, unquoted and code arguments', () => {
      const args = new Args(
        'unquoted \'single\' "double" `inline` ```\nblock-no-lang\n``` ```ts\nblock-with-lang\n```'
      );

      expect(args.size).to.equal(6);
      expect(args.next()?.val).to.equal('unquoted');
      expect(args.next()?.val).to.equal('single');
      expect(args.next()?.val).to.equal('double');
      expect(args.next()?.val).to.equal('inline');
      expect(args.next()?.val).to.equal('block-no-lang');
      expect(args.next()?.val).to.equal('block-with-lang');
      expect(args.prev()?.lang).to.equal('ts');
      expect(args.next()?.val).to.equal(undefined);
    });

    it('successfully execute all miscellaneous methods', () => {
      const args = new Args('arg1 arg2 arg3 arg4');

      expect(args.nth(0).val).to.equal('arg1');
      expect(args.next()?.val).to.equal('arg1');
      expect(args.next()?.val).to.equal('arg2');
      expect(args.prev().val).to.equal('arg2');
      expect(args.peek().val).to.equal('arg3');
      expect(args.setIndex(3).peek().val).to.equal('arg4');
      expect(args.size).to.equal(4);
      expect(args.toString()).to.equal('arg1 arg2 arg3 arg4');
    });
  });
});

describe('ARGUMENT', () => {
  it('successfully create a string argument', () => {
    const arg = new Arg('string argument', ArgFormat.UNQUOTED_STRING);

    expect(arg.val).to.equal('string argument');
    expect(arg.format).to.equal(ArgFormat.UNQUOTED_STRING);
    expect(arg.lang).to.equal(undefined);
  });
});
