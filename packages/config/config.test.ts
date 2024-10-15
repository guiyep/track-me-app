import { eslint } from './eslint.mjs';
import { prettier } from './prettier.mjs';

describe('Configs', () => {
  test('eslint', () => {
    expect(eslint()).toMatchSnapshot();
  });

  test('prettier', () => {
    expect(prettier()).toMatchSnapshot();
  });
});
