import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType,
} from 'aws-cdk-lib/aws-appsync';
import type { AccessProps } from '@track-me-app/aws';
import * as path from 'path';

const Consts = getConstants();

export class ReportTable extends Construct {
  private readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string, props?: AccessProps) {
    super(scope, id);

    this.table = new dynamodb.TableV2(this, Consts.ReportTable.TABLE_NAME, {
      partitionKey: {
        name: 'partitionKey',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: 'sortKey', type: dynamodb.AttributeType.STRING },
      tableName: Consts.ReportTable.TABLE_NAME,
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

    const api = new GraphqlApi(this, 'MyApi', {
      name: 'my-graphql-api',
      schema: SchemaFile.fromAsset(
        path.join(__dirname, 'graphql/schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      xrayEnabled: true,
    });

    api.addDynamoDbDataSource('MyTableDataSource', this.table);
  }
}
