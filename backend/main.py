import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Deployment: Serve Static Files
# This assumes 'npm run build' has been run and created a 'dist' folder in the project root
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")

if os.path.exists(DIST_DIR):
    # Mount assets (JS, CSS, Images)
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    # Catch-all route for SPA
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API routes to work if defined above (none currently)
        
        # Check if a specific file exists in dist (e.g. favicon.ico, logo.png)
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Fallback to index.html for client-side routing
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

else:
    @app.get("/")
    def read_root():
        return {
            "message": "Welcome to SolarHand Backend",
            "status": "Development Mode",
            "hint": "Run 'npm run build' to generate the frontend for production serving."
        }
