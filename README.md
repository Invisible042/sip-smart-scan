# SnapDrink AI - React Native Mobile App

A complete mobile application for drink analysis with AI-powered nutrition insights and health recommendations.

## Features

- **Mobile-First Design**: Native iOS and Android app built with Expo
- **Image Analysis**: Take photos or select from gallery to analyze drinks  
- **Real-time Nutrition Tracking**: Track calories, sugar, caffeine, and water intake
- **Daily Goals**: Set and monitor daily nutrition goals with progress tracking
- **Drink History**: Complete history of analyzed drinks with detailed breakdowns
- **Settings Management**: Configure notifications, health preferences, and privacy
- **Backend Integration**: Connects to Python FastAPI backend for AI analysis

## Tech Stack

- **Frontend**: React Native with Expo and TypeScript
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage for offline data persistence
- **UI**: Expo Vector Icons, Linear Gradients, Image Picker
- **Backend**: Python FastAPI with Google Cloud Vision & Nutritionix APIs

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Backend Setup

1. Start the Python backend:
   ```bash
   cd backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. Update API URL in `src/services/DrinkAnalysisService.ts` and `src/services/UserService.ts` to match your backend IP

## App Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx          # Main dashboard with stats and camera
│   ├── HistoryScreen.tsx       # Drink history and details  
│   └── SettingsScreen.tsx      # App settings and preferences
├── services/
│   ├── DrinkAnalysisService.ts # Backend API integration
│   └── UserService.ts          # User settings and goals management
└── types/
    └── index.ts                # TypeScript type definitions
```

## Key Features

### Home Screen
- Today's nutrition dashboard (calories, sugar, caffeine, water)
- Progress tracking for daily goals
- Floating camera button for instant drink analysis
- Pull-to-refresh for real-time data updates

### Drink Analysis Flow
1. Tap camera button
2. Choose camera or photo library
3. AI analyzes drink using backend
4. Get instant nutrition breakdown and health tips
5. Goals automatically update

### History & Tracking
- Complete chronological drink history
- Detailed nutrition breakdown per drink
- Personalized health tips for each drink
- Visual progress indicators

### Settings & Customization
- Daily goal configuration
- Notification preferences  
- Health profile management
- Privacy controls
- Offline data fallbacks

## Backend Integration

The app seamlessly integrates with the Python FastAPI backend:

- **AI Recognition**: Google Cloud Vision API for drink identification
- **Nutrition Data**: Nutritionix API for comprehensive nutrition facts
- **Health Tips**: OpenRouter AI for personalized recommendations
- **Goal Tracking**: Automatic progress updates and achievement tracking
- **Offline Support**: AsyncStorage fallbacks when backend unavailable

## Building for Production

### Development Build
```bash
npx expo build:android
npx expo build:ios
```

### Production Build
```bash
eas build --platform android
eas build --platform ios
```

## Deployment

1. **Google Play Store**: Upload APK/AAB from build process
2. **Apple App Store**: Upload IPA through Xcode or Application Loader
3. **Expo Updates**: Push OTA updates with `eas update`

## Permissions

- **Camera**: For taking photos of drinks
- **Photo Library**: For selecting existing images  
- **Internet**: For backend API communication
- **Storage**: For offline data persistence

The app provides a complete mobile experience for drink analysis and health tracking, with intelligent offline capabilities and seamless backend integration.