import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { CONFIGURATIONS } from './config';
import { getConstants } from '@track-me-app/be-consts';
import type { AccessProps } from '@track-me-app/aws';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

const Consts = getConstants();

export class GpsQueue extends Construct {
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

    this.dlq = new sqs.Queue(this, Consts.GpsLocationsQueue.DLQ, {
      visibilityTimeout: cdk.Duration.seconds(CONFIGURATIONS.VisibilityTimeout),
    });

    this.queue = new sqs.Queue(this, Consts.GpsLocationsQueue.QUEUE_NAME, {
      visibilityTimeout: cdk.Duration.seconds(CONFIGURATIONS.VisibilityTimeout),
      queueName: Consts.GpsLocationsQueue.QUEUE_NAME,
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

    const lambdaEventSource = new lambdaEventSources.SqsEventSource(
      this.queue,
      {
        batchSize: 5,
      },
    );

    props?.listeners?.forEach((listener) => {
      this.queue.grantConsumeMessages(listener);
      this.queue.grantSendMessages(listener);
      listener.addEventSource(lambdaEventSource);
    });
  }
}
