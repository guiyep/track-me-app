import { App } from 'aws-cdk-lib';
import { CloudStack } from '../cloud-stack';
import { Template } from 'aws-cdk-lib/assertions';

const app = new App();
const stack = new CloudStack(app, 'CloudStack');

describe('CloudStack', () => {
  it('should create a stack', () => {
    expect(stack).toBeDefined();
  });

  it('should api be defined properly', () => {
    const app = new App();
    const stack = new CloudStack(app, 'CloudStack');
    const template = Template.fromStack(stack);

    // Snapshot the entire stack
    expect(template.toJSON()).toMatchSnapshot();
  });
});
