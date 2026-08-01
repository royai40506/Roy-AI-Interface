#!/data/data/com.termux/files/usr/bin/bash

(
  export PORT=8080
  export NODE_ENV=development
  cd ~/Roy-AI-Interface/artifacts/api-server
  pnpm run dev > ~/Roy-AI-Interface/backend.log 2>&1
) &

sleep 8

export PORT=3000
cd ~/Roy-AI-Interface/artifacts/roy-ai
pnpm run dev
