Yellow='\033[0;33m'
echo "${Yellow}Updating localstack cloud environment"
echo ""
cd packages/cloud
cdklocal deploy
cd ..
cd ..