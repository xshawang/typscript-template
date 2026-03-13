#!/bin/bash

set -e


# # # 需要安装Node  18.12.0+
# 确保 deploy.sh 有执行权限
# if [ ! -x "./deploy.sh" ]; then
#   echo "🚀 给 deploy.sh 添加执行权限..."
#   chmod +x ./deploy.sh
# fi

# # 硬核拉远程所有最新内容
# echo "🚀 拉取远程最新代码和 tags..."
# git fetch --all --tags
# git reset --hard origin/main

# # 找到最新 tag
# latest_tag=$(git tag --sort=v:refname | tail -n 1)

# if [ -z "$latest_tag" ]; then
#   echo "❌ 没有找到任何 tag，退出！"
#   exit 1
# fi

# echo "🔖 最新 tag: $latest_tag"

# # 强制切换到最新 tag
# echo "🎯 切换到最新 tag..."
# git checkout "$latest_tag"

# # 安装依赖（如果需要）
# # npm install 

# # 构建
echo "🏗️ 正在构建..."
npm run build

# 重启 pm2
echo "🔄 重启 pm2..."
pm2 restart prod.ecosystem.config.js

#echo "✅ 部署完成！当前运行版本: $latest_tag"  注意此项目 是 /api 开头的，在处理nginx转发时加上。
