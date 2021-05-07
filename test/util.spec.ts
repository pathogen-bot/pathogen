/* eslint node/no-unpublished-import: 0 */

import {expect} from 'chai';
import {parseBoolean} from 'pathogen/util';

describe('UTILS', () => {
  describe('parseBoolean()', () => {
    it('resolves to true', () => {
      expect(parseBoolean('y')).to.equal(true);
      expect(parseBoolean('yes')).to.equal(true);
      expect(parseBoolean('t')).to.equal(true);
      expect(parseBoolean('true')).to.equal(true);
      expect(parseBoolean(1)).to.equal(true);
    });

    it('resolves to false', () => {
      expect(parseBoolean('n')).to.equal(false);
      expect(parseBoolean('no')).to.equal(false);
      expect(parseBoolean('f')).to.equal(false);
      expect(parseBoolean('false')).to.equal(false);
      expect(parseBoolean(0)).to.equal(false);
    });
  });
});
