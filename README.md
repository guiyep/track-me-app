# track-me-app

awslocal cloudformation describe-stacks --stack-name CloudStack \
 --query "Stacks[0].Outputs[0].OutputValue" --output text
