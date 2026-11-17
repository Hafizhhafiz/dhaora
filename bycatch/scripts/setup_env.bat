@echo off
REM ByCatch AI — Environment Setup Script (Windows 11)
echo ============================================================
echo Setting up ByCatch AI Virtual Environment...
echo ============================================================

cd /d "%~dp0\.."

IF NOT EXIST "venv" (
    echo Creating virtual environment in venv...
    py -m venv venv
)

echo Installing PyTorch CUDA 12.8 wheel...
.\venv\Scripts\python.exe -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128

echo Installing remaining project dependencies...
.\venv\Scripts\python.exe -m pip install -r requirements.txt

echo Verifying installation...
.\venv\Scripts\python.exe scripts\verify_install.py

echo Setup completed successfully.
pause
