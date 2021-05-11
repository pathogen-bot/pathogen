/* eslint node/no-unpublished-import: 0 */

import {expect} from 'chai';
import {LanguageClient} from 'pathogen';
import path from 'path';

describe('LANGUAGE', () => {
  let client: LanguageClient;

  describe('::new', () => {
    it('create language client without common', () => {
      client = new LanguageClient({
        langDir: __dirname,
        fallback: 'en',
      });
    });

    it('create language client with common', () => {
      client = new LanguageClient({
        langDir: __dirname,
        common: path.join(__dirname, 'common.ftl'),
        fallback: 'en',
      });
    });
  });

  describe('#load()', () => {
    it('load text without common', () => {
      const common = client.common;
      client.common = undefined;

      client.load('en', 'beep = beep boop');

      expect(client.registry.size).to.equal(1);
      client.common = common;
    });

    it('load text with common', () => {
      client
        .load('en', 'greeting = Hello, {$name}')
        .load('not-en', 'greeting = Hi, {$name}!!');

      expect(client.registry.size).to.equal(2);
    });
  });

  describe('#loadAll()', () => {
    it('load all files', () => {
      client.loadAll();

      expect(client.registry.size).to.equal(3);
    });
  });

  describe('#loadFile()', () => {
    it('load a file', () => {
      client.loadFile('en', path.join(__dirname, 'test.ftl'));
      client.loadFile('not-en', path.join(__dirname, 'test.ftl'));
    });
  });

  describe('#get()', () => {
    it('get text without placeholders', () => {
      const en = client.get('en', 'test');
      const notEn = client.get('not-en', 'test');

      expect(en).to.equal('test successful!');
      expect(notEn).to.equal('test successful!');
    });

    it('get text with placeholders', () => {
      const en = client.get('en', 'greeting', {name: 'Ben'});
      const notEn = client.get('not-en', 'greeting', {name: 'Ben'});

      expect(en).to.equal('Hello, Ben');
      expect(notEn).to.equal('Hi, Ben!!');
    });

    it('use fallback', () => {
      const fallback = client.get('other', 'test');

      expect(fallback).to.equal('test successful!');
    });

    it('missing key', () => {
      const errors: Error[] = [];
      const notFound = client.get('en', 'this-key-does-not-exist', {}, errors);

      expect(notFound).to.equal('this-key-does-not-exist');

      errors.forEach(e => expect(e).to.be.an('Error'));
    });

    it('unknown bundle', () => {
      const notFound = client.get('unknown-bundle', 'unknown-key');

      expect(notFound).to.equal('unknown-key');
    });

    it('missing key and fallback', () => {
      const fallback = client.fallback;
      client.fallback = '';

      const notFound = client.get('en', 'unknown-key');

      expect(notFound).to.equal('unknown-key');

      client.fallback = fallback;
    });
  });
});
