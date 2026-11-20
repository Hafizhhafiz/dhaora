@echo off
echo ======================================================================
echo CatchForecast AI - Menjalankan Server Web GIS Teluk Banten
echo ======================================================================
echo URL Web GIS: http://127.0.0.1:8000/
echo URL Swagger Docs: http://127.0.0.1:8000/docs
echo Tekan CTRL+C untuk menghentikan server.
echo ======================================================================
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
pause
