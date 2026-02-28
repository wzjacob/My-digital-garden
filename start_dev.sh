#!/bin/bash

# Digital Garden - 内网访问启动脚本
# 端口：3000

cd "$(dirname "$0")"

echo "=========================================="
echo "  Digital Garden"
echo "=========================================="
echo ""

# 检测本机内网 IP
get_lan_ip() {
  if command -v ip &> /dev/null; then
    ip route get 1 2>/dev/null | awk '{print $7; exit}' || hostname -I 2>/dev/null | awk '{print $1}'
  elif command -v ifconfig &> /dev/null; then
    ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
  else
    echo "localhost"
  fi
}

LAN_IP=$(get_lan_ip)

echo "正在启动开发服务器..."
echo ""
echo "访问地址："
echo "  本机：http://localhost:3000"
echo "  内网：http://${LAN_IP}:3000   （同一内网设备可访问）"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "=========================================="
echo ""

if ! command -v npm &> /dev/null; then
  echo "错误：未找到 npm，请先安装 Node.js"
  exit 1
fi

# 首次运行自动安装依赖
if [ ! -d "node_modules" ]; then
  echo "正在安装依赖..."
  npm install
  echo ""
fi

npm run dev:lan
