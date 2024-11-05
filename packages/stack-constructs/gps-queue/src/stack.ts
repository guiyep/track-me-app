import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NAME, VISIBILITY_TIMEOUT } from './config';

export class GpsQueue extends Construct {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.queue = new sqs.Queue(this, NAME, {
      visibilityTimeout: cdk.Duration.seconds(VISIBILITY_TIMEOUT),
    });
  }
}
