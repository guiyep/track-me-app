import { Construct } from 'constructs';
import type * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { getConstants } from '@track-me-app/be-consts';
import { CfnOutput } from 'aws-cdk-lib';
const Consts = getConstants();

export class GpsSns extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props?: {
      subscriptions?: sqs.IQueue[];
    },
  ) {
    super(scope, id);

    const topic = new sns.Topic(this, Consts.GpsSns.TOPIC_NAME);
    if (props?.subscriptions) {
      props.subscriptions.forEach((queue: sqs.IQueue) => {
        topic.addSubscription(new subscriptions.SqsSubscription(queue));
      });
    }

    new CfnOutput(this, `GpsSnsTopicArn`, {
      value: topic.topicArn,
    });
  }
}
