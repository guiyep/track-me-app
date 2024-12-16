import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import type { AccessProps } from '@track-me-app/aws';

const Consts = getConstants();

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
    created: number, (timestamp)
    lastUpdated: number (timestamp)
  }
}
 */

export class GpsTable extends Construct {
  private readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: AccessProps) {
    super(scope, id);

    this.table = new dynamodb.TableV2(this, Consts.GpsTable.TABLE_NAME, {
      partitionKey: {
        name: 'partitionKey',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.STRING },
      tableName: Consts.GpsTable.TABLE_NAME,
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
