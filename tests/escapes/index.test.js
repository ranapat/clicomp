import { expect } from 'chai';

import * as escapes from '../../src/escapes';

describe('Escapes', () => {
  it('should export colors and cursor', () => {
    expect(escapes.colors).not.to.be.an('undefined');
    expect(escapes.cursor).not.to.be.an('undefined');
  });
});
