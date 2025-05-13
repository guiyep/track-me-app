import type { IGrantable } from 'aws-cdk-lib/aws-iam';
import type { SQSMessageAttributes, SQSRecord } from 'aws-lambda';
import { logger } from '@track-me-app/logger';
export type AccessProps = {
  read?: IGrantable[];
  write?: IGrantable[];
  readAndWrite?: IGrantable[];
};

export const marshallSqsAttributes = (
  attributes: Record<string, number | string | boolean>,
): Record<string, { DataType: 'String' | 'Number'; StringValue: string }> =>
  Object.keys(attributes).reduce<
    Record<string, { DataType: 'String' | 'Number'; StringValue: string }>
  >((acc, key) => {
    const value = attributes[key];

    if (typeof value === 'string') {
      acc[key] = { DataType: 'String', StringValue: value };
    } else if (typeof value === 'number') {
      acc[key] = { DataType: 'Number', StringValue: String(value) }; // Convert number to string
    }
    return acc;
  }, {});

export const unmarshallSqsAttributes = (
  attributes: SQSMessageAttributes,
): Record<string, string | number> =>
  Object.keys(attributes).reduce<Record<string, string | number>>(
    (acc, key) => {
      const attribute = attributes[key];
      const stringValue = attribute.stringValue;
      const dataType = attribute.dataType;

      if (!stringValue) {
        return acc;
      }

      if (dataType === 'Number') {
        acc[key] = Number(stringValue);
      } else {
        acc[key] = stringValue;
      }
      return acc;
    },
    {},
  );

interface SnsEnvelope {
  Type: 'Notification';
  MessageId: string;
  TopicArn: string;
  Subject?: string;
  Message: string; // actual payload as JSON string
  MessageAttributes?: Record<
    string,
    {
      Type: string;
      Value: string;
    }
  >;
}

export const getSnsInfoFromLambdaRecord = logger.syncFunc(
  <T>(record: SQSRecord): { type: T; dataJson: string } => {
    const sqs = JSON.parse(record.body) as SnsEnvelope;
    logger.log(
      {
        message: `Getting SNS type from lambda record`,
      },
      record,
    );
    const type = sqs.MessageAttributes?.eventType.Value as T;
    return { type, dataJson: sqs.Message };
  },
  'getSnsTypeFromLambdaRecord',
);

export const parseToEntity = logger.syncFunc(<T>(dataJson: string): T => {
  const data = JSON.parse(dataJson) as T;
  logger.log(
    {
      message: `Getting SNS type from lambda record`,
    },
    data,
  );
  return data;
}, 'getSnsEntity');
