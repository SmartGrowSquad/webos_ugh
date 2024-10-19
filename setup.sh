#!/bin/bash

# Delete old IPK file
echo "delete old ipk file"
rm -rf com.ugh.app.browser_1.0.0_all.ipk
if [ $? -ne 0 ]; then
  echo "Failed to delete old IPK file. Exiting."
  exit 1
fi

cd $PWD/ugh
echo "delete old dist folder"
rm -rf dist

# Delete package-lock.json
echo "delete package-lock.json"
rm -rf package-lock.json
if [ $? -ne 0 ]; then
  echo "Failed to delete package-lock.json. Exiting."
  exit 1
fi

# Install npm dependencies
echo "running npm install"
npm uninstall websocket-stream ws
npm install
if [ $? -ne 0 ]; then
  echo "npm install failed. Exiting."
  exit 1
fi

# Run npm pack
echo "running npm run pack"
npm run pack
if [ $? -ne 0 ]; then
  echo "npm run pack failed. Exiting."
  exit 1
fi

cd ../ugh_service
rm -rf package-lock.json
echo "running npm install for service"
npm install
if [ $? -ne 0 ]; then
  echo "npm install failed. Exiting."
  exit 1
fi

# Remove old app
echo "delete old app"
# ares-install --remove com.ugh.app
# ares-install --remove com.ugh.app.service

if [ $? -ne 0 ]; then
  echo "Failed to remove old app. Exiting."
  exit 1
fi

# Create IPK package
cd ..
ares-package ugh/dist ugh_service
if [ $? -ne 0 ]; then
  echo "Failed to create IPK package. Exiting."
  exit 1
fi

# Install new app
ares-install com.ugh.app_1.0.0_all.ipk
if [ $? -eq 0 ]; then
    # ares-install이 성공적으로 끝났을 경우 추가 스크립트 실행
    echo "Starting next step after ares-install..."
    ares-inspect com.ugh.app | while read -r line
    do
        # "http://localhost..." 형태의 URL을 찾음
        if [[ $line =~ http://localhost:[0-9]+/devtools/inspector.html\?ws=localhost:[0-9]+/devtools/page/[A-Za-z0-9]+ ]]; then
            URL="${BASH_REMATCH[0]}"
            echo "URL found: $URL"

            # 추출된 URL을 Chrome으로 열기
            open -a "Google Chrome" "$URL"

            # 루프 종료
            break
        fi
    done
else
    echo "Failed to install new app. Exiting."
    exit 1
fi