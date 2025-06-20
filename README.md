# SnapDrink AI - Drink Analysis Mobile App

A complete mobile application for drink analysis with AI-powered nutrition insights and health recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11+
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sip-smart-scan
   ```

2. **Install all dependencies (Node.js + Python)**
   ```bash
   npm run install:all
   ```

### Running the Application

#### Start Both Services (Frontend + Backend)
```bash
npm start
```
This will start both the React Native frontend (Expo) and the Python FastAPI backend simultaneously.

#### Start Services Individually
```bash
# Frontend only (React Native/Expo)
npm run start:frontend-only

# Backend only (Python FastAPI)
npm run start:backend-only
```

#### Mobile Development
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 App Features

- **AI-Powered Drink Analysis**: Take photos of drinks and get instant nutrition insights
- **Health Recommendations**: Personalized health tips based on drink analysis
- **Daily Goal Tracking**: Monitor your daily nutrition intake
- **Offline Mode**: Works without backend connection using mock data
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🏗️ Project Structure

```
sip-smart-scan/
├── src/                    # React Native frontend source
│   ├── screens/           # App screens
│   ├── components/        # Reusable components
│   ├── services/          # API and business logic
│   └── types/             # TypeScript type definitions
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI application
│   ├── services/         # Business logic services
│   └── models/           # Data models
├── shared/               # Shared types and utilities
└── assets/               # Images, fonts, etc.
```

## 🔧 Development

### Available Scripts
- `npm start` - Start both frontend and backend
- `npm run install:all` - Install Node.js and Python dependencies
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Backend API
The backend runs on `http://localhost:8000` and provides:
- Drink analysis endpoints
- User management
- Health recommendations
- Nutrition data

### Frontend
The React Native app uses Expo SDK 52 and includes:
- Camera integration for drink photos
- Real-time analysis results
- Offline fallback mode
- Modern UI components

## 🚨 Troubleshooting

### Common Issues

1. **"Network request failed" error**
   - The app will automatically fall back to offline mode
   - Ensure the backend is running: `npm run start:backend-only`

2. **Python dependencies not found**
   - Run: `npm run install:python`

3. **Expo Go version mismatch**
   - Update Expo Go to the latest version
   - Or use: `npm run start:frontend-only -- --clear`

4. **Port conflicts**
   - Backend uses port 8000
   - Frontend uses port 8081
   - Ensure these ports are available

## 📄 License

This project is licensed under the MIT License.
