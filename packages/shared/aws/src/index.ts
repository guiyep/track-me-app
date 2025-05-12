import type { IGrantable } from 'aws-cdk-lib/aws-iam';
import type { SQSMessageAttributes, SNSEventRecord } from 'aws-lambda';
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

export const getSnsTypeFromLambdaRecord = logger.syncFunc(
   
  <T>(record: SNSEventRecord): T => {
    const sns = record.Sns;
    const type = sns.MessageAttributes.eventType.Value as T;
    return type;
  },
);
