import { eslint } from '@track-me-app/config/src/eslint.js';

export default eslint([
  {
    ignores: ['packages/cloud/bin/*', 'packages/cloud/cdk.out/*', 'scripts/*'],
  },
]);
