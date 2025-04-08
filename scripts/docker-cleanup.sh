#!/bin/bash

echo "🔍 Checking for running Docker containers..."
if docker ps -q &>/dev/null; then
    echo "🛑 Stopping Docker containers..."
    docker-compose down
    echo "✅ Docker containers stopped"
else
    echo "ℹ️  No Docker containers running"
fi 