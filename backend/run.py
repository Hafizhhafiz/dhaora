import uvicorn
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting ASIK VOL VI Backend on http://{host}:{port} ...")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
