@echo off
chcp 65001 >nul
title 一键Git提交推送
color 0A

set "msg="
for /f "delims=" %%s in ('powershell -Command "Add-Type -AssemblyName Microsoft.VisualBasic; $r=[Microsoft.VisualBasic.Interaction]::InputBox('请输入本次修改内容:','代码提交','日常更新'); if($r -ne $null){write $r}"') do set "msg=%%s"

if not defined msg (
    echo 已取消提交
    pause
    exit
)

echo.
echo 提交信息：%msg%
echo ------------------------
git add .
git commit -m "%msg%"
git push
echo ------------------------
echo 执行完毕！
pause