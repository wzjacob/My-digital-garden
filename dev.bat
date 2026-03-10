@echo off
REM 使用 0.0.0.0 允许局域网/外网访问（同一 WiFi 或公网可达时）
node node_modules\next\dist\bin\next dev -H 0.0.0.0
