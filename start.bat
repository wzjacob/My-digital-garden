@echo off
REM 生产模式启动，监听所有网卡（允许外网访问）
node node_modules\next\dist\bin\next start -H 0.0.0.0
pause
