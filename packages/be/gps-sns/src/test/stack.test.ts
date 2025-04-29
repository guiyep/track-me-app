import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GpsSns } from '../stack';
import { omit } from '@track-me-app/testing';

describe('GpsSns Stack', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  new GpsSns(stack, 'TestGpsSns');

  test('snapshot', () => {
    const template = Template.fromStack(stack);
    expect(omit(template.toJSON(), ['S3Key'])).toMatchSnapshot();
  });
});
