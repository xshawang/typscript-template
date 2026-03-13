#!/bin/bash
git pull && npm run build && pm2 restart dev.ecosystem.config.js
echo "✅ 部署完成！"
