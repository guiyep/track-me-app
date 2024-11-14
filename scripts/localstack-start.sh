Yellow='\033[0;33m'
echo "${Yellow}Starting localstack cloud environment"
echo ""
cd packages/cloud
cdklocal bootstrap
cd ..
cd ..