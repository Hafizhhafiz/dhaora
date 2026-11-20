Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "CatchForecast AI - Menjalankan Server Web GIS Teluk Banten" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "URL Web GIS: http://127.0.0.1:8000/" -ForegroundColor Yellow
Write-Host "URL Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "Tekan CTRL+C untuk menghentikan server." -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
