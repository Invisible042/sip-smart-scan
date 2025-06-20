import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DrinkAnalysisService } from '../services/DrinkAnalysisService';
import { UserService } from '../services/UserService';
import { DailyGoal, DrinkData } from '../types';
import { DrinkResultsScreen } from './DrinkResultsScreen';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    sugar: 0,
    caffeine: 0,
    water: 0,
    drinkCount: 0,
  });
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentDrinkData, setCurrentDrinkData] = useState<DrinkData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [yesterdayStats, setYesterdayStats] = useState({
    calories: 0,
    sugar: 0,
    caffeine: 0,
    water: 0,
    drinkCount: 0,
  });
  const [selectedDay, setSelectedDay] = useState<'today' | 'yesterday'>('today');
  const [displayStats, setDisplayStats] = useState(todayStats);
  const [displayGoals, setDisplayGoals] = useState<DailyGoal[]>(goals);

  const userService = new UserService('default');

  useEffect(() => {
    loadData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'We need camera roll permissions to select photos'
      );
    }
  };

  const loadData = async () => {
    try {
      const stats = await DrinkAnalysisService.getTodayStats();
      setTodayStats(stats);

      const dailyGoals = await userService.getDailyGoals();
      setGoals(dailyGoals);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const showImagePicker = () => {
    Alert.alert('Add Drink', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Photo Library', onPress: () => openLibrary() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      handleImageResponse(result.assets[0].uri);
    }
  };

  const openLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      handleImageResponse(result.assets[0].uri);
    }
  };

  const handleImageResponse = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const drinkData = await DrinkAnalysisService.analyzeDrink(imageUri);
      setCurrentDrinkData(drinkData);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze drink. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmDrink = async () => {
    setShowResults(false);
    setCurrentDrinkData(null);
    await loadData(); // Refresh the stats
  };

  const handleCancelDrink = () => {
    setShowResults(false);
    setCurrentDrinkData(null);
  };

  const getGoalProgress = (goalType: string) => {
    const goal = goals.find(g => g.type === goalType);
    if (!goal || goal.target === 0) return 0;
    return Math.min(goal.current / goal.target, 1);
  };

  const getYesterdayStats = async () => {
    try {
      // Try backend first
      const response = await fetch('http://localhost:8000/user/default/drinks/yesterday');
      if (response.ok) {
        const data = await response.json();
        const totals = data.totals || {};
        return {
          calories: totals.calories || 0,
          sugar: totals.sugar || 0,
          caffeine: totals.caffeine || 0,
          water: totals.water || 0,
          drinkCount: totals.drinkCount || 0,
        };
      }
    } catch (error) {
      // Fallback to local storage
      const drinks: DrinkData[] = await userService.getDrinksFromStorage();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yestStr = yesterday.toDateString();
      const yestDrinks = drinks.filter((drink: DrinkData) => new Date(drink.timestamp).toDateString() === yestStr);
      return {
        calories: yestDrinks.reduce((sum: number, drink: DrinkData) => sum + drink.calories, 0),
        sugar: yestDrinks.reduce((sum: number, drink: DrinkData) => sum + (drink.sugar || 0), 0),
        caffeine: yestDrinks.reduce((sum: number, drink: DrinkData) => sum + (drink.caffeine || 0), 0),
        water: yestDrinks.reduce((sum: number, drink: DrinkData) => sum + (drink.water || 0), 0),
        drinkCount: yestDrinks.length,
      };
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getYesterdayStats().then(stats => {
        setYesterdayStats(stats || { calories: 0, sugar: 0, caffeine: 0, water: 0, drinkCount: 0 });
      });
    }, [])
  );

  const getCalorieGoal = () => {
    const goal = goals.find(g => g.type === 'calories');
    return goal ? goal.target : 2000;
  };

  // Helper to get date string
  const getDateString = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // Fetch goals for a given date
  const fetchGoalsForDate = async (dateStr: string) => {
    const historyRaw = await AsyncStorage.getItem('daily_goals_history');
    if (historyRaw) {
      const history = JSON.parse(historyRaw);
      if (history[dateStr]) return history[dateStr];
    }
    // fallback to current goals
    return goals;
  };

  // Update displayStats and displayGoals when selectedDay changes
  useEffect(() => {
    const updateDisplay = async () => {
      if (selectedDay === 'today') {
        setDisplayStats(todayStats);
        setDisplayGoals(goals);
      } else {
        setDisplayStats(yesterdayStats);
        const yestStr = getDateString(-1);
        const yestGoals = await fetchGoalsForDate(yestStr);
        setDisplayGoals(yestGoals);
      }
    };
    updateDisplay();
  }, [selectedDay, todayStats, yesterdayStats, goals]);

  // Helper to get a goal by type from displayGoals
  const getGoal = (type: string) => {
    const goal = displayGoals.find(g => g.type === type);
    return goal ? goal.target : 2000;
  };

  const StatCard = ({ title, value, unit, color, progress = 0, icon }: any) => (
    <View style={[styles.statCard, { flex: 1, margin: 4 }]}>
      <LinearGradient colors={color} style={styles.statGradient}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={20} color="white" />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>
          {value}
          {unit}
        </Text>
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>🥤</Text>
          <Text style={styles.title}>SnapDrink</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Add vertical space after header */}
        <View style={{ height: 16 }} />
        {/* Main Calories Card (uses displayStats and displayGoals) */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, selectedDay === 'today' && styles.toggleButtonActive]}
              onPress={() => setSelectedDay('today')}
            >
              <Text style={[styles.toggleText, selectedDay === 'today' && styles.toggleTextActive]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, selectedDay === 'yesterday' && styles.toggleButtonActive]}
              onPress={() => setSelectedDay('yesterday')}
            >
              <Text style={[styles.toggleText, selectedDay === 'yesterday' && styles.toggleTextActive]}>Yesterday</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <View>
              <Text style={styles.mainValue}>{displayStats.calories}</Text>
              <Text style={styles.mainLabel}>Calories consumed</Text>
            </View>
            <View style={styles.circularProgressContainer}>
              <View style={styles.circularProgressBackground}>
                <View 
                  style={[
                    styles.circularProgressFill,
                    { 
                      width: `${Math.min(displayStats.calories / getGoal('calories'), 1) * 100}%`,
                      height: '100%'
                    }
                  ]} 
                />
              </View>
              <View style={styles.circularProgressIcon}>
                <Ionicons name="flame" size={28} color="#10b981" />
                <Text style={styles.circularProgressText}>
                  {Math.round((displayStats.calories / getGoal('calories')) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <StatCard
              title="Sugar"
              value={displayStats.sugar}
              unit="g"
              color={['#ef4444', '#dc2626']}
              progress={getGoalProgress('sugar')}
              icon="nutrition"
            />
            <StatCard
              title="Caffeine"
              value={displayStats.caffeine}
              unit="mg"
              color={['#f59e0b', '#d97706']}
              progress={getGoalProgress('caffeine')}
              icon="flash"
            />
          </View>
          <View style={styles.statRow}>
            <StatCard
              title="Water"
              value={Math.round((displayStats.water / 1000) * 10) / 10}
              unit="L"
              color={['#3b82f6', '#2563eb']}
              progress={getGoalProgress('water')}
              icon="water"
            />
            <StatCard
              title="Drinks"
              value={displayStats.drinkCount}
              unit=""
              color={['#8b5cf6', '#7c3aed']}
              progress={displayStats.drinkCount / 8}
              icon="cafe"
            />
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          {displayGoals.map(goal => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalValue}>
                  {Math.round(goal.current)}/{goal.target} {goal.unit}
                </Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View
                  style={[
                    styles.goalProgressFill,
                    {
                      width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                      backgroundColor: goal.is_achieved ? '#10b981' : '#3b82f6',
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.fabGradient}
        >
          <Ionicons name="camera" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.9)']}
            style={styles.loadingContainer}
          >
            <View style={styles.loadingContent}>
              <Ionicons name="camera" size={48} color="#10b981" />
              <Text style={styles.loadingTitle}>Analyzing Drink...</Text>
              <Text style={styles.loadingSubtitle}>AI is processing your image</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Drink Results Modal */}
      <Modal
        visible={showResults}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {currentDrinkData && (
          <DrinkResultsScreen
            drinkData={currentDrinkData}
            onClose={handleCancelDrink}
            onConfirm={handleConfirmDrink}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for FAB
  },
  mainCard: {
    borderRadius: 24,
    margin: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainValue: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
  },
  mainLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  circularProgressContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  circularProgressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 40,
  },
  circularProgressIcon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  statsGrid: {
    paddingHorizontal: 16,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statCard: {
    borderRadius: 16,
  },
  statGradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  goalItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  goalValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    marginHorizontal: 4,
  },
  toggleButtonActive: {
    backgroundColor: '#10b981',
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#0f172a',
  },
  toggleWrapper: {
    marginTop: 12,
    marginBottom: 0,
    alignItems: 'center',
  },
});
