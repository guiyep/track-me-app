Yellow='\033[0;33m'
echo "${Yellow}Destroying localstack cloud environment"
echo ""
cd packages/cloud
cdklocal destroy --all
cd ..
cd ..