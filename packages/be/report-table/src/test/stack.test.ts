import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ReportTable } from '../stack';
import { getConstants } from '@track-me-app/be-consts';
import { omit } from '@track-me-app/testing';

const Consts = getConstants();

describe('ReportTable Stack', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  new ReportTable(stack, 'TestReportTable');

  test('snapshot', () => {
    const template = Template.fromStack(stack);
    expect(omit(template.toJSON(), ['S3Key'])).toMatchSnapshot();
  });

  test('should create a DynamoDB table with correct properties', () => {
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: Consts.ReportTable.TABLE_NAME,
    });
  });
});
