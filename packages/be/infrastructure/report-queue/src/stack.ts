import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { CONFIGURATIONS } from './config';
import { getConstants } from '@track-me-app/be-consts';
import type { AccessProps } from '@track-me-app/aws';
import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput } from 'aws-cdk-lib';

const Consts = getConstants();

export class ReportQueue extends Construct {
  public readonly queue: sqs.Queue;
  public readonly dlq: sqs.Queue;

  constructor(
    scope: Construct,
    id: string,
    props?: AccessProps & {
      listeners?: IFunction[];
    },
  ) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, Consts.ReportQueue.DLQ, {
      visibilityTimeout: cdk.Duration.seconds(CONFIGURATIONS.VisibilityTimeout),
    });

    this.queue = new sqs.Queue(this, Consts.ReportQueue.QUEUE_NAME, {
      visibilityTimeout: cdk.Duration.seconds(CONFIGURATIONS.VisibilityTimeout),
      queueName: Consts.ReportQueue.QUEUE_NAME,
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount: 3,
      },
    });

    props?.read?.forEach((grantable) => {
      this.queue.grantConsumeMessages(grantable);
    });

    props?.write?.forEach((grantable) => {
      this.queue.grantSendMessages(grantable);
    });

    props?.readAndWrite?.forEach((grantable) => {
      this.queue.grantConsumeMessages(grantable);
      this.queue.grantSendMessages(grantable);
    });

    props?.listeners?.forEach((listener) => {
      listener.addEventSource(
        new lambdaEventSources.SqsEventSource(this.queue),
      );
      new CfnOutput(this, `ReportQueueEventSourcing`, {
        value: `fn:${listener.functionName} - queue:${this.queue.queueArn}`,
      });
    });

    new CfnOutput(this, `ReportQueueArn`, {
      value: this.queue.queueArn,
    });

    new CfnOutput(this, `ReportQueueUrl`, {
      value: this.queue.queueUrl,
    });

    new CfnOutput(this, `ReportQueueDlqUrl`, {
      value: this.dlq.queueUrl,
    });
  }
}
