# Combined Dockerfile for Hugging Face Spaces
FROM python:3.12-slim

WORKDIR /app

# Install Node.js for building frontend
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend
RUN cd frontend && VITE_API_URL= npm run build

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/app ./backend/app

# Configure nginx
RUN rm /etc/nginx/sites-enabled/default
COPY <<'EOF' /etc/nginx/sites-available/shottool
server {
    listen 7860;

    location / {
        root /app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;
    }
}
EOF
RUN ln -s /etc/nginx/sites-available/shottool /etc/nginx/sites-enabled/

# Start script
COPY <<'EOF' /app/start.sh
#!/bin/bash
cd /app/backend && uvicorn app.main:app --host 127.0.0.1 --port 8000 &
nginx -g 'daemon off;'
EOF
RUN chmod +x /app/start.sh

EXPOSE 7860

CMD ["/app/start.sh"]
