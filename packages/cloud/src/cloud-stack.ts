import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { ReportQueue } from '@track-me-app/report-queue';
import { Api } from '@track-me-app/api';
import { GpsTable } from '@track-me-app/gps-table';
import { ReportProcessor } from '@track-me-app/report-processor';
import { ReportTable } from '@track-me-app/report-table';
import { GpsSns } from '@track-me-app/gps-sns';

export const STACK_IDS = {
  ReportQueueStack: 'ReportQueueStack',
  MainApiStack: 'MainApiStack',
  GpsTableStack: 'GpsTableStack',
  ReportProcessorStack: 'ReportProcessorStack',
  ReportTableStack: 'ReportTableStack',
  GpsSnsStack: 'GpsSnsStack',
};

export class CloudStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new Api(this, STACK_IDS.MainApiStack);

    new GpsTable(this, STACK_IDS.GpsTableStack, {
      readAndWrite: [api.lambdaApi],
    });

    const reportProcessing = new ReportProcessor(
      this,
      STACK_IDS.ReportProcessorStack,
    );

    new ReportTable(this, STACK_IDS.ReportTableStack, {
      readAndWrite: [reportProcessing.lambda],
    });

    const queueStack = new ReportQueue(this, STACK_IDS.ReportQueueStack, {
      listeners: [reportProcessing.lambda],
    });

    new GpsSns(this, STACK_IDS.GpsSnsStack, {
      readAndWrite: [api.lambdaApi],
      queueSubscriptions: [
        {
          queue: queueStack.queue,
          listenTo: ['LOCATION_ADDED', 'SETTINGS_ADDED'],
        },
      ],
    });
  }
}
