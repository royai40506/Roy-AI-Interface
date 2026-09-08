#!/data/data/com.termux/files/usr/bin/bash

PROJECT="$HOME/Roy-AI-Interface"
API="$PROJECT/artifacts/api-server"
LOG="$PROJECT/backend.log"

export PATH="/data/data/com.termux/files/usr/bin:$PATH"
export PORT=3000
export NODE_ENV=production

if pgrep -f 'node --enable-source-maps ./dist/index.mjs' >/dev/null 2>&1; then
    exit 0
fi

termux-wake-lock >/dev/null 2>&1 || true

cd "$API" || exit 1

nohup node --enable-source-maps ./dist/index.mjs \
    >> "$LOG" 2>&1 &

echo "$(date '+%Y-%m-%d %H:%M:%S') BACKEND_STARTED PID=$!" >> "$LOG"
