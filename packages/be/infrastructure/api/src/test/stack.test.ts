import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Api } from '../stack';
import { NAMES } from '../config';
import { omit } from '@track-me-app/testing';

describe('Api Stack', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  new Api(stack, 'TestApi');

  test('snapshot', () => {
    const template = Template.fromStack(stack);
    expect(omit(template.toJSON(), ['S3Key'])).toMatchSnapshot();
  });

  test('should create an API Gateway with correct properties', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: NAMES.ApiGateway,
    });
  });

  test('should create a Lambda function with correct properties', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: NAMES.Lambda,
      Runtime: 'nodejs18.x',
      Handler: 'index.handler',
    });
  });
});
