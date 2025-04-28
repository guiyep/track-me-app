curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: fe651dd8" \
  -d '{
    "query": "query ListReportEntries($partitionKey: String) { listReportEntries(partitionKey: $partitionKey) { partitionKey sortKey } }",
    "variables": {
      "partitionKey": "84e7f8e0-9ff2-4bd4-96f8-4e9fdb06651d"
    }
  }' \
  http://localhost.localstack.cloud:4566/graphql/c56283e92b1d4e4197b6f5d3e0