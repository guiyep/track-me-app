import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GpsQueue } from '@track-me-app/gps-queue';
import { Api } from '@track-me-app/api';
import { GpsTable } from '@track-me-app/gps-table';
import { ReportProcessor } from '@track-me-app/report-processor';

const STACK_IDS = {
  GpsQueueStack: 'GpsQueueStack',
  MainApiStack: 'MainApiStack',
  GpsTableStack: 'GpsTableStack',
  ReportProcessorStack: 'ReportProcessorStack',
};

export class CloudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new Api(this, STACK_IDS.MainApiStack);

    const reportProcessing = new ReportProcessor(
      this,
      STACK_IDS.ReportProcessorStack,
    );

    new GpsQueue(this, STACK_IDS.GpsQueueStack, {
      readAndWrite: [api.lambdaApi],
      listeners: [reportProcessing.lambda],
    });

    new GpsTable(this, STACK_IDS.GpsTableStack, {
      readAndWrite: [api.lambdaApi],
    });
  }
}
