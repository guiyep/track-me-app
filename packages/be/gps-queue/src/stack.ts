import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { CONFIGURATIONS } from './config';
import { getConstants } from '@track-me-app/be-consts';
import type { AccessProps } from '@track-me-app/aws';

const Consts = getConstants();

export class GpsQueue extends Construct {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string, props?: AccessProps) {
    super(scope, id);

    this.queue = new sqs.Queue(this, Consts.GpsLocationsQueue.QUEUE_NAME, {
      visibilityTimeout: cdk.Duration.seconds(CONFIGURATIONS.VisibilityTimeout),
      queueName: Consts.GpsLocationsQueue.QUEUE_NAME,
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
  }
}
