import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GpsQueue } from '@track-me-app/gps-queue';

export class CloudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GpsQueue(scope, id);
  }
}
