#!/bin/bash

# Function to get GraphQL API ID by name
get_graphql_api_id() {
    awslocal appsync list-graphql-apis \
        --query "graphqlApis[?name=='ReportsGraphqlApi'].apiId" \
        --output text
}

# Function to get GraphQL API URL from AppSync
get_graphql_url() {
    local api_id="$1"
    awslocal appsync get-graphql-api \
        --api-id "$api_id" \
        --query "graphqlApi.uris.GRAPHQL" \
        --output text
}

# Function to get GraphQL API key
get_graphql_key() {
    local api_id="$1"
    awslocal appsync list-api-keys \
        --api-id "$api_id" \
        --query "apiKeys[0].id" \
        --output text
}

# Function to write to environment file
write_to_env_file() {
    local graphql_url="$1"
    local graphql_key="$2"
    local env_type="$3"
    local env_file=".env.$env_type"
    local temp_file=".env.$env_type.tmp"
    
    # Create a temporary file
    touch "$temp_file"
    
    # If the original file exists, copy all non-GraphQL variables
    if [ -f "$env_file" ]; then
        grep -v "^GraphqlUrl=" "$env_file" | grep -v "^GraphqlKey=" > "$temp_file"
    fi
    
    # Add the new GraphQL variables
    echo "GraphqlUrl=$graphql_url" >> "$temp_file"
    echo "GraphqlKey=$graphql_key" >> "$temp_file"
    
    # Replace the original file with the temporary one
    mv "$temp_file" "$env_file"
    
    if [ $? -eq 0 ]; then
        echo "Successfully updated GraphQL URL and key in $env_file"
    else
        echo "Error: Failed to update $env_file"
        exit 1
    fi
}

# Main function
main() {
    local api_id
    local graphql_url
    local graphql_key
    
    api_id=$(get_graphql_api_id)
    if [ -z "$api_id" ]; then
        echo "Error: Failed to get API ID for ReportsGraphqlApi"
        exit 1
    fi
    
    graphql_url=$(get_graphql_url "$api_id")
    if [ -z "$graphql_url" ]; then
        echo "Error: Failed to get GraphQL URL from AppSync"
        exit 1
    fi
    
    graphql_key=$(get_graphql_key "$api_id")
    if [ -z "$graphql_key" ]; then
        echo "Error: Failed to get GraphQL key from AppSync"
        exit 1
    fi
    
    write_to_env_file "$graphql_url" "$graphql_key" "test"
    write_to_env_file "$graphql_url" "$graphql_key" "dev"
}

# Execute main function
main 