#!/bin/bash

# Start development servers for Shot Match

echo "Starting Shot Match development servers..."

# Start backend
echo "Starting backend server on http://localhost:8000"
cd backend
pip install -r requirements.txt > /dev/null 2>&1
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start frontend
echo "Starting frontend server on http://localhost:5173"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Shot Match is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# Wait for either process to exit
wait
