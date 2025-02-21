Yellow='\033[0;33m'
White='\033[1;37m'
Green='\033[0;32m'
LightBlue='\033[1;36m'
Blue='\033[0;34m'

echo "${LightBlue} 🤘🤘🤘🤘🤘🤘 Starting dev env 🤘🤘🤘🤘🤘🤘"

# Wait for Docker to be ready
echo "${White} ⏳ Starting Docker..."
echo "${White} ------------------------------------------------"
killall Docker
open -a Docker
sleep 5
echo "${LightBlue} ✅ Docker running!"

echo "${White} ⏳ Starting localstack..."
echo "${White} ------------------------------------------------"
osascript -e 'tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session
            write text "localstack start"
        end tell
    end tell
end tell'
osascript -e 'tell application "iTerm"
    tell current window
        select tab 2
    end tell
end tell'
sleep 5
echo "${LightBlue} ✅ Localstack running!"

echo "${White} ⏳ Starting local env..."
echo "${White} ------------------------------------------------"
cd packages/cloud
cdklocal bootstrap
cd ..
cd ..
echo "${LightBlue} ✅ Local env running!"
echo "${White} ------------------------------------------------"
echo "${Green} 👌 Cloud environment running! 😉 happy dev 😁 "
echo ""