---
description: How to deploy the SolarHand application
---

This guide explains how to deploy the SolarHand application, which consists of a React frontend and a Python FastAPI backend.

## Deployment Strategy
We use a **Unified Deployment** strategy where the Python backend serves the compiled React frontend. This allows you to deploy the entire application as a single web service.

## Prerequisites
- Node.js installed
- Python 3.10+ installed

## Step 1: Build the Frontend
Compile the React application into static files.
```bash
npm run build
```
This creates a `dist/` directory containing the production-ready frontend.

## Step 2: Prepare Backend
Ensure your `backend/main.py` is configured to serve the `dist/` folder (Configuration already applied).

## Step 3: Deployment Options

### Option A: Deploy to Render (Recommended)
1. Push your code to a GitHub repository.
2. Create a new **Web Service** on [Render](https://render.com).
3. Connect your repository.
4. Use the following settings:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt && npm install && npm run build`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy!

### Option B: Run Locally (Production Mode)
To run the production version locally:
```bash
# 1. Build frontend
npm run build

# 2. Start backend
cd backend
# Windows
.\venv\Scripts\Activate.ps1
# Mac/Linux
# source venv/bin/activate

# 3. Run server
uvicorn main:app --host 0.0.0.0 --port 8000
```
Then visit `http://localhost:8000`.

## Directory Structure
```
/
├── dist/               # Built frontend (generated)
├── backend/
│   ├── main.py        # Validates dist exists and serves it
│   └── requirements.txt
├── package.json
└── vite.config.ts
```
