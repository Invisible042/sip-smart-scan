# SnapDrink AI

A complete drink analysis application with AI-powered nutrition insights and health recommendations.

## Features

- **Image Upload & Analysis**: Upload photos of drinks for instant identification
- **Google Cloud Vision API**: Automatically detects drink labels and text
- **Nutritionix API Integration**: Fetches detailed nutrition information
- **AI Health Tips**: Personalized health recommendations using OpenRouter AI
- **Mobile-First UI**: Responsive design optimized for mobile devices
- **Local Storage**: Tracks drink history and daily goals

## Architecture

### Frontend (React + TypeScript)
- Modern React app with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Local storage for data persistence

### Backend (Python FastAPI)
- FastAPI for high-performance API
- Google Cloud Vision for image analysis
- Nutritionix API for nutrition data
- OpenRouter AI for health insights
- CORS enabled for frontend integration

## API Endpoints

### `POST /upload`
Upload a drink image for analysis
- **Input**: Multipart form with image file
- **Output**: Drink name, nutrition data, and health tip

### `GET /health`
Check backend service status
- **Output**: Service availability status

## Setup Instructions

### Backend Setup
1. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn python-multipart pillow google-cloud-vision requests openai python-dotenv
   ```

2. Set up environment variables (copy `.env.example` to `.env`):
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
   NUTRITIONIX_APP_ID=your-app-id
   NUTRITIONIX_APP_KEY=your-app-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```

3. Start the backend:
   ```bash
   cd backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the app in your browser
2. Tap the camera/upload button on the main screen
3. Select or take a photo of a drink
4. View instant nutrition analysis and health tips
5. Track your daily intake and goals

## API Integration

The app automatically falls back to local databases when external APIs are unavailable:
- **Vision API**: Falls back to random drink selection
- **Nutrition API**: Uses comprehensive local nutrition database
- **Health Tips**: Uses categorized tip database

This ensures the app works reliably even without API keys configured.