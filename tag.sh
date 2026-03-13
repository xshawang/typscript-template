#!/bin/bash

set -e

# version.txt 文件路径
VERSION_FILE="version.txt"

# 检查 version.txt 是否存在
if [ ! -f "$VERSION_FILE" ]; then
  echo "v2.0.0" > "$VERSION_FILE"
  echo "🌟 初始化 version.txt 为 v2.0.0"
fi

# 确保 Git 工作区干净（只排除 version.txt）
if [[ -n $(git status --porcelain | grep -v "$VERSION_FILE") ]]; then
  echo "❌ Git 工作区有未提交的变更（除了 version.txt），请先处理。"
  git status
  exit 1
fi

# 读取当前版本号
current_version=$(cat "$VERSION_FILE" | tr -d '\n')

echo "🔍 当前版本号: $current_version"

# 去掉开头的 v
pure_version=${current_version#v}

# 分割成数组（按 . 分隔）
IFS='.' read -r major minor patch <<< "$pure_version"

# 补保险，防止出错
major=${major:-0}
minor=${minor:-0}
patch=${patch:-0}

# 小版本号 +1
patch=$((patch + 1))

# 组装新的版本号
new_version="v${major}.${minor}.${patch}"

# 更新 version.txt
echo "$new_version" > "$VERSION_FILE"
echo "🆙 新版本号: $new_version"

# 提交新的 version.txt
git add "$VERSION_FILE"
git commit -m "chore: bump version to $new_version"

# 打 Tag
git tag -a "$new_version" -m "Release $new_version"

# 推送代码 + Tag
git push
git push origin "$new_version"

echo "✅ 版本 $new_version 打包并推送完成！"
