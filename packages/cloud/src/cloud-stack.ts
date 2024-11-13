import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GpsQueue } from '@track-me-app/gps-queue';
import { Api } from '@track-me-app/api';

const STACK_IDS = {
  GpsQueueStack: 'GpsQueueStack',
  MainApiStack: 'MainApiStack',
};

export class CloudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GpsQueue(this, STACK_IDS.GpsQueueStack);
    new Api(this, STACK_IDS.MainApiStack);
  }
}
