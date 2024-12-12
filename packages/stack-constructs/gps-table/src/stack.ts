import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NAMES } from './config';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

/*
schema {
  key: 'userId',
  subKey: 'sessionId',
  data: {
    userId: string,
    displayName: string,
    avatarSrc: string,
    sessionId: string,
    lat: number,
    lond:number,
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
      partitionKey: { name: 'key', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'subKey', type: dynamodb.AttributeType.STRING },
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
