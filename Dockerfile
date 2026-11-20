# ==============================================================================
# ASIK VOL VI / DHAORA Multi-Stage Production Dockerfile
# ==============================================================================

# --- Stage 1: Build Frontend SPA ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python Backend & Unified Gateway ---
FROM python:3.11-slim
WORKDIR /app

# Install lightweight system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python ML & API dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Copy built frontend from Stage 1 into production SPA dist folders
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist /app/dhaora/frontend/dist

# Cloud hosting configuration
ENV HOST=0.0.0.0
ENV PORT=5173
ENV PYTHONUNBUFFERED=1

EXPOSE 5173

CMD ["python", "dhaora/backend/run.py"]
