#!/bin/bash

# Function to get API URL from CloudFormation
get_api_url() {
    awslocal cloudformation describe-stacks \
        --stack-name CloudStack \
        --query "Stacks[0].Outputs[0].OutputValue" \
        --output text
}

# Main function
main() {
    local api_url
    api_url=$(get_api_url)
    
    if [ -z "$api_url" ]; then
        echo "Error: Failed to get API URL from CloudFormation"
        exit 1
    fi
    
    echo "$api_url"
}

# Execute main function
main 