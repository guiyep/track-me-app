import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NAMES } from './config';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

/*
schema {
  partitionKey: '[email]',
  sortKey: '[sessionId]',
  data: {
    email: string,
    displayName: string,
    avatarSrc: string,
    sessionId: string,
    lat: number,
    long:number,
    timestamp: number,
  }
}
 */

interface AccessProps {
  read?: IGrantable[];
  write?: IGrantable[];
  readAndWrite?: IGrantable[];
}

export class GpsTable extends Construct {
  private readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: AccessProps) {
    super(scope, id);

    this.table = new dynamodb.TableV2(this, NAMES.DynamoGpsTable, {
      partitionKey: {
        name: 'partitionKey',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.STRING },
      tableName: NAMES.DynamoGpsTable,
    });

    props?.read?.forEach((grantable) => {
      this.table.grantReadData(grantable);
    });

    props?.write?.forEach((grantable) => {
      this.table.grantWriteData(grantable);
    });

    props?.readAndWrite?.forEach((grantable) => {
      this.table.grantReadWriteData(grantable);
    });
  }
}
