import { App } from 'aws-cdk-lib';
import { CloudStack } from '../cloud-stack';
import { Template } from 'aws-cdk-lib/assertions';
import { omit } from '@track-me-app/testing';

const app = new App();
const stack = new CloudStack(app, 'CloudStack');

describe('CloudStack', () => {
  it('should create a stack', () => {
    expect(stack).toBeDefined();
  });

  it('should stack be defined properly', () => {
    const app = new App();
    const stack = new CloudStack(app, 'CloudStack');
    const template = Template.fromStack(stack);

    // Snapshot the entire stack
    expect(omit(template.toJSON(), ['S3Key', 'Expires'])).toMatchSnapshot();
  });
});
