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
    local temp_file="${env_file}.tmp"
    
    # Create a temporary file
    touch "$temp_file"
    
    # If the environment file exists, read and preserve existing variables
    if [ -f "$env_file" ]; then
        # Read each line from the existing file
        while IFS= read -r line; do
            # Skip empty lines and comments
            if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
                echo "$line" >> "$temp_file"
                continue
            fi
            
            # If the line contains ApiUrl, update it
            if [[ "$line" =~ ^ApiUrl= ]]; then
                echo "ApiUrl=$api_url" >> "$temp_file"
            else
                # Preserve other variables
                echo "$line" >> "$temp_file"
            fi
        done < "$env_file"
    fi
    
    # If ApiUrl wasn't found in the existing file, add it
    if ! grep -q "^ApiUrl=" "$temp_file"; then
        echo "ApiUrl=$api_url" >> "$temp_file"
    fi
    
    # Replace the original file with the temporary file
    mv "$temp_file" "$env_file"
    
    if [ $? -eq 0 ]; then
        echo "Successfully updated API URL in $env_file"
    else
        echo "Error: Failed to update $env_file"
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