#!/bin/bash

echo "🚀 Starting LocalStack bootstrap process..."

# Wait for LocalStack to be ready with loading indicator
echo -n "⏳ Waiting for LocalStack to be ready... ["
for i in {1..10}; do
    echo -n "▓"
    sleep 1
done
echo "] ✅"

# Change to cloud package directory
echo "📂 Changing to cloud package directory..."
cd packages/cloud

# Run CDK bootstrap
echo "🔄 Running CDK bootstrap..."
cdklocal bootstrap
echo "✅ CDK bootstrap completed!"

# Run CDK deploy
echo "🚀 Starting CDK deployment..."
cdklocal deploy --all --require-approval never
echo "✅ CDK deployment completed!"

# Return to root directory
cd ../..

# Set API URL
echo "🔗 Setting API URL..."
yarn set-api-url
echo "✅ Bootstrap process completed successfully! 🎉" 