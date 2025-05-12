import { Construct } from 'constructs';
import type * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { getConstants } from '@track-me-app/be-consts';
import { CfnOutput } from 'aws-cdk-lib';
import type { AccessProps } from '@track-me-app/aws';
const Consts = getConstants();

// filterPolicy: {
//       eventType: sns.SubscriptionFilter.stringFilter({
//         allowlist: ['UserSignedUp'],
//       }),
//     },

export class GpsSns extends Construct {
  private readonly topic: sns.Topic;

  constructor(
    scope: Construct,
    id: string,
    props?: AccessProps & {
      queueSubscriptions?: {
        queue: sqs.IQueue;
        listenTo?: (keyof typeof Consts.GpsSns.MESSAGES)[];
      }[];
    },
  ) {
    super(scope, id);

    this.topic = new sns.Topic(this, Consts.GpsSns.TOPIC_NAME);

    if (props?.queueSubscriptions) {
      props.queueSubscriptions.forEach(({ queue, listenTo }) => {
        this.topic.addSubscription(
          new subscriptions.SqsSubscription(queue, {
            filterPolicy: listenTo?.reduce<
              Record<string, sns.SubscriptionFilter>
            >((acc, message) => {
              acc[message] = sns.SubscriptionFilter.stringFilter({
                allowlist: [message],
              });
              return acc;
            }, {}),
          }),
        );
      });
    }

    props?.read?.forEach((grantable) => {
      this.topic.grantSubscribe(grantable);
    });

    props?.write?.forEach((grantable) => {
      this.topic.grantPublish(grantable);
    });

    props?.readAndWrite?.forEach((grantable) => {
      this.topic.grantSubscribe(grantable);
      this.topic.grantPublish(grantable);
    });

    new CfnOutput(this, `GpsSnsTopicArn`, {
      value: this.topic.topicArn,
      description: 'The ARN of the GPS SNS topic',
    });
  }
}
