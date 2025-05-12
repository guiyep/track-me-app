import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType,
  MappingTemplate,
} from 'aws-cdk-lib/aws-appsync';
import type { AccessProps } from '@track-me-app/aws';
import * as path from 'path';
import { CfnOutput } from 'aws-cdk-lib';
// import { CfnOutput, Duration, Expiration } from 'aws-cdk-lib';

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

    const graphqlApiName = `${Consts.ReportTable.TABLE_NAME}GraphqlApi`;

    const api = new GraphqlApi(this, graphqlApiName, {
      name: graphqlApiName,
      schema: SchemaFile.fromAsset(
        path.join(__dirname, 'graphql/schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY, // for dev; use IAM or Cognito in prod
          // apiKeyConfig: {
          //   expires: Expiration.after(Duration.days(365)),
          // },
        },
      },
      xrayEnabled: true,
    });

    const dataSource = api.addDynamoDbDataSource(
      `${Consts.ReportTable.TABLE_NAME}DataSource`,
      this.table,
    );

    // Configure resolver for listReportEntries query
    dataSource.createResolver('ListReportEntriesResolver', {
      typeName: 'Query',
      fieldName: 'listReportEntries',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          'graphql/resolvers/list-report-entries/Query.listReportEntries.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.join(
          __dirname,
          'graphql/resolvers/list-report-entries/Query.listReportEntries.res.vtl',
        ),
      ),
    });

    new CfnOutput(this, `${graphqlApiName}-URL`, {
      value: api.graphqlUrl,
    });
    new CfnOutput(this, `${graphqlApiName}-KEY`, {
      value: api.apiKey ?? '',
    });
  }
}
