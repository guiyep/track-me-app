import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GpsQueue } from '../stack';
import { getConstants } from '@track-me-app/be-consts';
import { omit } from '@track-me-app/testing';
import { CONFIGURATIONS } from '../config';

const Consts = getConstants();

describe('GpsQueue Stack', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  new GpsQueue(stack, 'TestGpsQueue');

  test('snapshot', () => {
    const template = Template.fromStack(stack);
    expect(omit(template.toJSON(), ['S3Key'])).toMatchSnapshot();
  });

  test('should create an SQS queue with correct properties', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Consts.GpsLocationsQueue.QUEUE_NAME,
      VisibilityTimeout: CONFIGURATIONS.VisibilityTimeout,
    });
  });

  test('should configure DLQ for main queue', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Consts.GpsLocationsQueue.QUEUE_NAME,
      RedrivePolicy: {
        maxReceiveCount: 3,
      },
    });
  });
});
