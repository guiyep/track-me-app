Yellow='\033[0;33m'
echo "${Yellow}Updating localstack cloud environment"
echo ""
cd packages/cloud
cdklocal deploy --require-approval never
cd ..
cd ..
echo "${Green}Localstack cloud environment updated"
echo ""
