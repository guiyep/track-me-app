import { IGrantable } from 'aws-cdk-lib/aws-iam';

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
