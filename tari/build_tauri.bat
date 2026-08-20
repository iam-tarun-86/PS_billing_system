@echo off
echo ==========================================================
echo          TAURI STANDALONE EXE and INSTALLER BUILDER
echo ==========================================================
echo.
echo Initializing MSVC Developer Command Prompt...
call "C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvars64.bat"

echo Appending Cargo to PATH...
set "PATH=%PATH%;%USERPROFILE%\.cargo\bin"

echo Running Tauri production build...
npx tauri build

echo.
echo Build process completed!
echo If successful, your installer will be in:
echo   tari\src-tauri\target\release\bundle\msi\
echo.
pause
