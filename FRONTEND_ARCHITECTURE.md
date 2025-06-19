# Frontend Architecture Documentation

## Overview
The SnapDrink AI mobile application is built using React Native with Expo, following modern mobile development patterns and best practices.

## Technology Stack

### Core Technologies
- **React Native**: 0.72.6 (Cross-platform mobile framework)
- **Expo**: ~49.0.0 (Development platform and tooling)
- **TypeScript**: Full type safety and developer experience
- **React Navigation**: Bottom tab navigation pattern

### UI & Styling
- **React Native Built-in Components**: View, Text, ScrollView, etc.
- **Expo Vector Icons**: Ionicons for consistent iconography
- **Expo Linear Gradient**: Modern gradient backgrounds
- **StyleSheet API**: Platform-optimized styling

### Storage & State
- **AsyncStorage**: Client-side data persistence
- **React Hooks**: Local state management (useState, useEffect)
- **Context API**: Prepared for global state (if needed)

### Device Integration
- **Expo Image Picker**: Camera and photo library access
- **Expo Camera**: Direct camera integration
- **SafeAreaView**: Handle device-specific screen areas

## Project Structure

```
├── App.tsx                          # Root component with navigation
├── src/
│   ├── screens/                     # Screen components
│   │   ├── HomeScreen.tsx          # Main dashboard
│   │   ├── HistoryScreen.tsx       # Drink history
│   │   └── SettingsScreen.tsx      # User preferences
│   ├── services/                    # Business logic layer
│   │   ├── DrinkAnalysisService.ts # Drink analysis & storage
│   │   └── UserService.ts          # User settings & goals
│   ├── types/                      # TypeScript definitions
│   │   └── index.ts                # Shared type definitions
│   └── components/                 # Reusable UI components (future)
├── assets/                         # Static assets (icons, images)
├── app.json                        # Expo configuration
├── metro.config.js                 # Metro bundler configuration
├── babel.config.js                 # Babel transpilation config
└── tsconfig.json                   # TypeScript configuration
```

## Screen Architecture

### Navigation Structure

```typescript
// App.tsx - Root navigation setup
<NavigationContainer>
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
</NavigationContainer>
```

**Navigation Configuration:**
- Bottom tab navigation for primary sections
- Dark theme with teal accent colors
- Ionicons for tab icons
- No header (custom header in each screen)

### Screen Components Detail

#### HomeScreen.tsx

**Purpose**: Main dashboard with real-time statistics and camera integration

**Component Structure**:
```typescript
export const HomeScreen: React.FC = () => {
  // State management
  const [todayStats, setTodayStats] = useState(initialStats);
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Effects and data loading
  useEffect(() => { loadData(); }, []);

  // Event handlers
  const loadData = async () => { ... };
  const onRefresh = async () => { ... };
  const showImagePicker = () => { ... };
  const handleImageResponse = async (imageUri: string) => { ... };

  // UI rendering
  return (
    <SafeAreaView>
      <ScrollView refreshControl={refreshControl}>
        {/* Header */}
        {/* Main Calories Card */}
        {/* Stats Grid */}  
        {/* Today's Goals */}
      </ScrollView>
      {/* Floating Action Button */}
    </SafeAreaView>
  );
};
```

**UI Components**:
1. **Header**: App title with profile button
2. **Main Calories Card**: Large calorie display with progress indicator
3. **Stats Grid**: 2x2 grid of nutrition stats (sugar, caffeine, water, drinks)
4. **Goals Section**: List of daily goals with progress bars
5. **Floating Action Button**: Camera trigger with gradient background

**State Flow**:
```
Mount → loadData() → Service calls → State updates → UI render
User action → Image picker → Analysis → Alert → loadData() → UI refresh
Pull-to-refresh → loadData() → State updates → UI refresh
```

#### HistoryScreen.tsx

**Purpose**: Chronological display of drink history with detailed information

**Component Structure**:
```typescript
export const HistoryScreen: React.FC = () => {
  // State management
  const [drinks, setDrinks] = useState<DrinkData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Data loading
  const loadDrinks = async () => {
    const drinkHistory = await DrinkAnalysisService.getDrinksFromStorage();
    setDrinks(drinkHistory);
  };

  // UI rendering with nested components
  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        {drinks.length === 0 ? <EmptyState /> : drinks.map(DrinkItem)}
      </ScrollView>
    </SafeAreaView>
  );
};
```

**Nested Components**:
```typescript
// DrinkItem - Individual drink display
const DrinkItem: React.FC<DrinkItemProps> = ({ drink }) => {
  return (
    <View style={styles.drinkItem}>
      <DrinkHeader />      // Name, time, calories
      <NutritionGrid />    // Sugar, caffeine, water stats
      <HealthTip />        // AI-generated advice
    </View>
  );
};
```

**Data Flow**:
```
Mount → loadDrinks() → AsyncStorage → Parse/sort → State update → Render
Pull-to-refresh → loadDrinks() → Updated state → Re-render
```

#### SettingsScreen.tsx

**Purpose**: User preferences and app configuration management

**Component Structure**:
```typescript
export const SettingsScreen: React.FC = () => {
  // Event handlers
  const handleSettingsPress = (setting: string) => {
    // Currently shows alerts, future: navigation to setting screens
    Alert.alert(setting, `${setting} settings would open here`);
  };

  // Settings configuration
  const settingsItems = [
    { icon: 'notifications', title: 'Notifications', ... },
    { icon: 'trophy', title: 'Daily Goals', ... },
    // ... more settings
  ];

  return (
    <SafeAreaView>
      <Header />
      <ScrollView>
        <ProfileCard />          // User profile with avatar
        <SettingsSection />      // List of setting items
        <AppInfo />             // Version and description
      </ScrollView>
    </SafeAreaView>
  );
};
```

## Service Layer Architecture

### DrinkAnalysisService.ts

**Purpose**: Handles drink analysis, backend communication, and local storage

**Key Methods**:

```typescript
class DrinkAnalysisService {
  // Main analysis workflow
  static async analyzeDrink(imageUri: string): Promise<DrinkData> {
    // 1. Create FormData with image
    // 2. POST to backend /upload endpoint
    // 3. Transform backend response to DrinkData
    // 4. Save to AsyncStorage
    // 5. Return processed data
  }

  // Local storage operations
  private static async saveDrinkLocally(drink: DrinkData): Promise<void> {
    // Retrieve existing drinks, add new drink, save back
  }

  static async getDrinksFromStorage(): Promise<DrinkData[]> {
    // Get all drinks from AsyncStorage with error handling
  }

  // Statistics calculations
  static async getTodayDrinks(): Promise<DrinkData[]> {
    // Filter drinks by today's date
  }

  static async getTodayStats() {
    // Calculate totals: calories, sugar, caffeine, water, count
  }
}
```

**Error Handling Strategy**:
```typescript
try {
  // Backend API call
  const response = await fetch(API_URL, options);
  if (!response.ok) throw new Error(`Backend error: ${response.status}`);
  return await response.json();
} catch (error) {
  console.error('API call failed:', error);
  throw error; // Let UI components handle display
}
```

### UserService.ts

**Purpose**: Manages user settings, goals, and preferences with backend sync

**Key Methods**:

```typescript
class UserService {
  // Settings management with fallback pattern
  static async getNotifications(): Promise<NotificationSettings> {
    try {
      // Try backend API first
      const response = await fetch(`${API_BASE_URL}/user/${userId}/notifications`);
      if (response.ok) return await response.json();
    } catch (error) {
      // Silent fallback to AsyncStorage
    }
    
    // Local fallback with default values
    const stored = await AsyncStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : defaultNotificationSettings;
  }

  static async updateNotifications(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      // Try backend update
      await fetch(backendUrl, { method: 'PUT', body: JSON.stringify(settings) });
    } catch (error) {
      // Silent fallback
    }
    
    // Always update local storage
    const current = await this.getNotifications();
    await AsyncStorage.setItem('notifications', JSON.stringify({ ...current, ...settings }));
  }
}
```

**Fallback Strategy**:
1. Attempt backend API call
2. On failure, use AsyncStorage
3. Provide sensible defaults if no local data
4. No user-facing error messages
5. Background sync when network available

## State Management Patterns

### Local State with Hooks

**Standard Pattern**:
```typescript
const ScreenComponent: React.FC = () => {
  // State declarations
  const [data, setData] = useState<DataType>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effects for data loading
  useEffect(() => {
    loadData();
  }, []);

  // Data loading function
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await SomeService.getData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI rendering with conditional display
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;
  return <DataDisplay data={data} />;
};
```

### Refresh Control Pattern

**Implementation**:
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await loadData(); // Reload data from services
  setRefreshing(false);
};

// In render:
<ScrollView 
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {/* Content */}
</ScrollView>
```

## Data Flow Patterns

### Unidirectional Data Flow

```
User Action → Event Handler → Service Call → Backend API → Response Processing → State Update → UI Re-render
```

### Example: Drink Analysis Flow

```typescript
// 1. User taps camera button
const showImagePicker = () => {
  Alert.alert('Add Drink', 'Choose option', [
    { text: 'Camera', onPress: openCamera },
    { text: 'Library', onPress: openLibrary }
  ]);
};

// 2. User selects image source
const openCamera = async () => {
  const result = await ImagePicker.launchCameraAsync(options);
  if (!result.canceled) {
    handleImageResponse(result.assets[0].uri);
  }
};

// 3. Process selected image
const handleImageResponse = async (imageUri: string) => {
  try {
    // Service call with backend integration
    const drinkData = await DrinkAnalysisService.analyzeDrink(imageUri);
    
    // Show results to user
    Alert.alert('Drink Analyzed!', 
      `${drinkData.name}\n${drinkData.calories} calories\n\n${drinkData.healthTip}`,
      [{ text: 'OK', onPress: () => loadData() }]
    );
  } catch (error) {
    Alert.alert('Error', 'Failed to analyze drink. Please try again.');
  }
};

// 4. Refresh data after successful analysis
const loadData = async () => {
  const stats = await DrinkAnalysisService.getTodayStats();
  const goals = await UserService.getDailyGoals();
  setTodayStats(stats);
  setGoals(goals);
};
```

## UI/UX Patterns

### Design System

**Color Palette**:
```typescript
const colors = {
  primary: '#0f172a',      // Dark background
  secondary: '#1e293b',    // Card backgrounds
  accent: '#10b981',       // Success/action color
  error: '#ef4444',        // Error states
  warning: '#f59e0b',      // Warning states
  info: '#3b82f6',         // Info states
  text: '#ffffff',         // Primary text
  textSecondary: 'rgba(255,255,255,0.6)', // Secondary text
  border: 'rgba(255,255,255,0.1)', // Borders
};
```

**Typography Scale**:
```typescript
const typography = {
  largeTitle: { fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold' },
  headline: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' },
};
```

**Spacing System**:
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Component Patterns

**Card Pattern**:
```typescript
const CardComponent = ({ children, style, ...props }) => (
  <View style={[styles.baseCard, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
```

**Gradient Pattern**:
```typescript
const GradientCard = ({ colors, children, ...props }) => (
  <LinearGradient colors={colors} style={styles.gradientContainer} {...props}>
    {children}
  </LinearGradient>
);
```

**Icon Button Pattern**:
```typescript
const IconButton = ({ name, onPress, size = 24, color = 'white' }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <Ionicons name={name} size={size} color={color} />
  </TouchableOpacity>
);
```

## Performance Optimizations

### Image Handling
- Image compression in ImagePicker (quality: 0.8)
- Local URI storage for quick display
- Lazy loading for history items

### Data Loading
- Asynchronous data fetching
- Local storage caching
- Pull-to-refresh for manual updates
- Optimistic UI updates

### Memory Management
- Proper cleanup in useEffect
- Avoid memory leaks in async operations
- Efficient state updates

### Bundle Optimization
- Expo managed workflow for optimized builds
- Tree shaking for unused code elimination
- Asset optimization through Expo

## Testing Considerations

### Component Testing
```typescript
// Example test structure (Jest + React Native Testing Library)
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  it('should load today stats on mount', async () => {
    const { getByText } = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByText(/calories/i)).toBeTruthy();
    });
  });
});
```

### Service Testing
```typescript
// Mock AsyncStorage and fetch for service tests
jest.mock('@react-native-async-storage/async-storage');
jest.mock('global.fetch');

describe('DrinkAnalysisService', () => {
  it('should analyze drink and save locally', async () => {
    // Test implementation
  });
});
```

## Deployment Architecture

### Development
- Expo Go app for instant testing
- Hot reloading for rapid development
- Metro bundler for fast builds

### Production
- EAS Build for native app compilation
- App Store Connect / Google Play Console distribution
- Over-the-air updates via Expo Updates

This architecture provides a scalable, maintainable foundation for the SnapDrink AI mobile application with clear separation of concerns and robust data management.