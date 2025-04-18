#!/bin/bash

# Function to get API URL from CloudFormation
get_api_url() {
    awslocal cloudformation describe-stacks \
        --stack-name CloudStack \
        --query "Stacks[0].Outputs[0].OutputValue" \
        --output text
}

# Function to write to environment file
write_to_env_file() {
    local api_url="$1"
    local env_type="$2"
    local env_file=".env.$env_type"
    
    # Create or overwrite the environment file
    echo "ApiUrl=$api_url" > "$env_file"
    
    if [ $? -eq 0 ]; then
        echo "Successfully wrote API URL to $env_file"
    else
        echo "Error: Failed to write to $env_file"
        exit 1
    fi
}

# Main function
main() {
    local api_url
    api_url=$(get_api_url)
    
    if [ -z "$api_url" ]; then
        echo "Error: Failed to get API URL from CloudFormation"
        exit 1
    fi
    
    write_to_env_file "$api_url" "test"
    write_to_env_file "$api_url" "dev"
}

# Execute main function
main 