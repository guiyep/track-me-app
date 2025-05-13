import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NAMES } from './config';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class ReportProcessor extends Construct {
  public lambda: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.lambda = new NodejsFunction(this, NAMES.Lambda, {
      functionName: NAMES.Lambda,
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, './lambda/index.ts'),
      handler: 'handler',
    });
  }
}
