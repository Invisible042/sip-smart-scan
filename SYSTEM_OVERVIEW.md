# SnapDrink AI - System Overview

## Project Summary
SnapDrink AI is a comprehensive mobile application that uses artificial intelligence to analyze drinks from photos and provide personalized nutrition insights and health recommendations.

## Documentation Index

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| [DOCUMENTATION.md](DOCUMENTATION.md) | Complete system architecture and data flows | Developers, Architects |
| [API_REFERENCE.md](API_REFERENCE.md) | Detailed API endpoints and usage | Frontend Developers, Integrators |
| [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | React Native mobile app structure | Frontend Developers |
| [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) | Python FastAPI backend design | Backend Developers |
| [MOBILE_SETUP.md](MOBILE_SETUP.md) | Mobile app setup instructions | Developers, DevOps |

## System Components

### Mobile Application (React Native + Expo)
- **Technology**: React Native, Expo, TypeScript
- **Screens**: HomeScreen, HistoryScreen, SettingsScreen
- **Services**: DrinkAnalysisService, UserService
- **Storage**: AsyncStorage for offline capabilities
- **Features**: Camera integration, real-time stats, goal tracking

### Backend API (Python FastAPI)
- **Technology**: FastAPI, Python 3.11+, Uvicorn
- **Services**: Vision, Nutrition, Health Tips, User Management
- **Storage**: File-based JSON storage
- **External APIs**: Google Cloud Vision, Nutritionix, OpenRouter AI

## Key Features

### Core Functionality
1. **Image Analysis**: AI-powered drink recognition from photos
2. **Nutrition Tracking**: Comprehensive nutrition data with real-time calculations
3. **Health Insights**: Personalized health tips based on consumption patterns
4. **Goal Management**: Customizable daily nutrition goals with progress tracking
5. **History Tracking**: Complete drink history with analytics

### AI Integration
- **Google Cloud Vision API**: Image recognition and text detection
- **Nutritionix API**: Comprehensive nutrition database
- **OpenRouter AI**: Personalized health recommendations
- **Fallback Systems**: Local databases for offline functionality

### User Experience
- **Offline Support**: Full functionality without internet connection
- **Real-time Updates**: Instant goal progress and statistics
- **Mobile-First Design**: Touch-optimized interface
- **Dark Theme**: Professional, battery-friendly design

## Data Flow Architecture

```
Mobile App → Image Capture → Backend Analysis → AI Processing → Response
     ↓              ↓              ↓              ↓           ↓
Local Storage ← Goal Updates ← User Profile ← Health Tips ← Nutrition Data
```

### Analysis Workflow
1. User captures/selects drink image
2. Image sent to backend via multipart/form-data
3. Google Cloud Vision identifies drink name
4. Nutritionix provides comprehensive nutrition data
5. OpenRouter AI generates personalized health tip
6. Backend updates user goals and history
7. Response sent to mobile app with complete analysis
8. Mobile app displays results and updates local storage

### Settings Management
1. User modifies preferences in mobile app
2. Changes sent to backend API endpoints
3. Backend validates and persists changes
4. AsyncStorage updated for offline access
5. UI reflects updated preferences immediately

## API Endpoints Summary

| Category | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| Analysis | `/upload` | POST | Analyze drink from image |
| Profile | `/user/{id}/profile` | GET | Complete user profile |
| Settings | `/user/{id}/notifications` | GET/PUT | Notification preferences |
| Settings | `/user/{id}/health-preferences` | GET/PUT | Health profile |
| Settings | `/user/{id}/privacy` | GET/PUT | Privacy settings |
| Goals | `/user/{id}/daily-goals` | GET/POST/PUT | Goal management |
| Analytics | `/user/{id}/drinks/today` | GET | Today's consumption |
| Analytics | `/user/{id}/drinks/weekly-stats` | GET | Weekly patterns |
| System | `/health` | GET | Service status |

## Technology Decisions

### Frontend Choices
- **React Native**: Cross-platform mobile development
- **Expo**: Rapid development and deployment
- **AsyncStorage**: Offline data persistence
- **Bottom Tab Navigation**: Mobile-standard UI pattern

### Backend Choices
- **FastAPI**: Modern, high-performance Python framework
- **File Storage**: Simple, reliable data persistence
- **Async Processing**: Efficient I/O handling
- **Pydantic**: Type-safe data validation

### Integration Strategy
- **RESTful API**: Standard HTTP/JSON communication
- **Graceful Degradation**: Offline functionality with fallbacks
- **Error Resilience**: Silent fallbacks to local data
- **Performance Optimization**: Caching and async processing

## Security & Privacy

### Data Protection
- API key management via environment variables
- Input validation and sanitization
- File upload security (type and size limits)
- Optional data collection with user control

### Privacy Features
- User-controlled data collection settings
- Local data storage for sensitive information
- No personal data in logs
- Transparent data usage policies

## Performance Features

### Mobile Optimization
- Image compression for faster uploads
- Local caching for instant responses
- Pull-to-refresh for data updates
- Efficient state management

### Backend Optimization
- Asynchronous request processing
- Intelligent API fallbacks
- In-memory caching
- Efficient JSON serialization

## Deployment Architecture

### Development Environment
- Expo Go for instant mobile testing
- FastAPI with hot reloading
- Local file storage
- Environment-based configuration

### Production Considerations
- Native app builds (iOS/Android)
- Scalable ASGI server deployment
- Database migration path
- API rate limiting and monitoring

## Getting Started

### Quick Setup
1. **Backend**: `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
2. **Mobile**: `npm install && npx expo start`
3. **Test**: Scan QR code with Expo Go app

### API Keys (Optional)
- `GOOGLE_APPLICATION_CREDENTIALS`: For enhanced image recognition
- `NUTRITIONIX_APP_ID` & `NUTRITIONIX_APP_KEY`: For extended nutrition database
- `OPENROUTER_API_KEY`: For advanced AI health recommendations

### Full Documentation
- Complete setup instructions in [MOBILE_SETUP.md](MOBILE_SETUP.md)
- API integration guide in [API_REFERENCE.md](API_REFERENCE.md)
- Architecture details in [DOCUMENTATION.md](DOCUMENTATION.md)

## Support and Maintenance

### System Monitoring
- `/health` endpoint for service status monitoring
- Comprehensive error logging
- Fallback system status indicators

### Extensibility
- Modular service architecture
- Type-safe data models
- Pluggable AI service providers
- Configurable storage backends

The SnapDrink AI system provides a complete, production-ready solution for AI-powered nutrition tracking with robust offline capabilities and comprehensive user management.