import { eslint } from './eslint.js';
import { prettier } from './prettier.js';

describe('Configs', () => {
  test('eslint', () => {
    expect(eslint()).toMatchSnapshot();
  });

  test('prettier', () => {
    expect(prettier()).toMatchSnapshot();
  });
});
