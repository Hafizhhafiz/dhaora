#!/usr/bin/env bash
# ==============================================================================
# ASIK VOL VI / DHAORA Unified Cloud Build Script (Render / Railway / VPS)
# ==============================================================================

set -o errexit

echo ">>> [1/3] Menginstal dependensi Python backend..."
pip install --upgrade pip
pip install -r requirements.txt

echo ">>> [2/3] Membangun antarmuka produksi Frontend SPA..."
cd frontend
npm install
npm run build
cd ..

echo ">>> [3/3] Menyinkronkan aset SPA ke DHAORA dist..."
mkdir -p dhaora/frontend/dist
cp -r frontend/dist/* dhaora/frontend/dist/

echo ">>> Build selesai dan siap dijalankan!"
