import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NAMES } from './config';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface ApiProps {
  dependencies: {
    gpsSqs: string;
  };
}

export class Api extends Construct {
  public lambdaApi: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.lambdaApi = new NodejsFunction(this, NAMES.Lambda, {
      functionName: NAMES.Lambda,
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, '../src/lambda/index.ts'),
      handler: 'handler',
    });

    new LambdaRestApi(this, NAMES.ApiGateway, {
      handler: this.lambdaApi,
      restApiName: NAMES.ApiGateway,
    });
  }
}
