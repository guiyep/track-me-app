import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ReportQueue } from '../stack';
import { getConstants } from '@track-me-app/be-consts';
import { omit } from '@track-me-app/testing';
import { CONFIGURATIONS } from '../config';

const Consts = getConstants();

describe('ReportQueue Stack', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  new ReportQueue(stack, 'TestReportQueue');

  test('snapshot', () => {
    const template = Template.fromStack(stack);
    expect(omit(template.toJSON(), ['S3Key'])).toMatchSnapshot();
  });

  test('should create an SQS queue with correct properties', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Consts.ReportQueue.QUEUE_NAME,
      VisibilityTimeout: CONFIGURATIONS.VisibilityTimeout,
    });
  });

  test('should configure DLQ for main queue', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Consts.ReportQueue.QUEUE_NAME,
      RedrivePolicy: {
        maxReceiveCount: 3,
      },
    });
  });
});
