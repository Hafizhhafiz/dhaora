@echo off
REM ByCatch AI — Streamlit Application Launcher
echo ============================================================
echo Starting ByCatch AI Application...
echo ============================================================

cd /d "%~dp0"

IF NOT EXIST "venv\Scripts\streamlit.exe" (
    echo [ERROR] Virtual environment or Streamlit not found in venv\Scripts\
    echo Please install dependencies first or run scripts\setup_env.bat
    pause
    exit /b 1
)

echo Initializing local SQLite database...
.\venv\Scripts\python.exe scripts\init_db.py

echo Launching Streamlit web dashboard...
.\venv\Scripts\streamlit.exe run app\main.py --server.port 8501 --server.headless false

pause
