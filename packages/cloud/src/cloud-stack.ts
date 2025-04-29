import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { ReportQueue } from '@track-me-app/report-queue';
import { Api } from '@track-me-app/api';
import { GpsTable } from '@track-me-app/gps-table';
import { ReportProcessor } from '@track-me-app/report-processor';
import { ReportTable } from '@track-me-app/report-table';

export const STACK_IDS = {
  ReportQueueStack: 'ReportQueueStack',
  MainApiStack: 'MainApiStack',
  GpsTableStack: 'GpsTableStack',
  ReportProcessorStack: 'ReportProcessorStack',
  ReportTableStack: 'ReportTableStack',
};

export class CloudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new Api(this, STACK_IDS.MainApiStack);

    const reportProcessing = new ReportProcessor(
      this,
      STACK_IDS.ReportProcessorStack,
    );

    new ReportQueue(this, STACK_IDS.ReportQueueStack, {
      readAndWrite: [api.lambdaApi],
      listeners: [reportProcessing.lambda],
    });

    new GpsTable(this, STACK_IDS.GpsTableStack, {
      readAndWrite: [api.lambdaApi, reportProcessing.lambda],
    });

    new ReportTable(this, STACK_IDS.ReportTableStack, {
      readAndWrite: [reportProcessing.lambda],
    });
  }
}
