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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { DrinkAnalysisService } from '../services/DrinkAnalysisService';
import { UserService } from '../services/UserService';
import { DailyGoal } from '../types';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    sugar: 0,
    caffeine: 0,
    water: 0,
    drinkCount: 0
  });
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to select photos');
    }
  };

  const loadData = async () => {
    try {
      const stats = await DrinkAnalysisService.getTodayStats();
      setTodayStats(stats);
      
      const dailyGoals = await UserService.getDailyGoals();
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
    Alert.alert(
      'Add Drink',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Photo Library', onPress: () => openLibrary() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
    try {
      const drinkData = await DrinkAnalysisService.analyzeDrink(imageUri);
      Alert.alert(
        'Drink Analyzed!',
        `${drinkData.name}\n${drinkData.calories} calories\n\n${drinkData.healthTip}`,
        [{ text: 'OK', onPress: () => loadData() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze drink. Please try again.');
    }
  };

  const getGoalProgress = (goalType: string) => {
    const goal = goals.find(g => g.type === goalType);
    if (!goal || goal.target === 0) return 0;
    return Math.min(goal.current / goal.target, 1);
  };

  const StatCard = ({ title, value, unit, color, progress = 0, icon }: any) => (
    <View style={[styles.statCard, { flex: 1, margin: 4 }]}>
      <LinearGradient colors={color} style={styles.statGradient}>
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={20} color="white" />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statValue}>{value}{unit}</Text>
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.emoji}>🥤</Text>
            <Text style={styles.title}>SnapDrink</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Calories Card */}
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <View>
              <Text style={styles.mainValue}>{todayStats.calories}</Text>
              <Text style={styles.mainLabel}>Calories consumed</Text>
            </View>
            <View style={styles.circularProgress}>
              <Ionicons name="flame" size={32} color="white" />
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <StatCard
              title="Sugar"
              value={todayStats.sugar}
              unit="g"
              color={['#ef4444', '#dc2626']}
              progress={getGoalProgress('sugar')}
              icon="nutrition"
            />
            <StatCard
              title="Caffeine"
              value={todayStats.caffeine}
              unit="mg"
              color={['#f59e0b', '#d97706']}
              progress={getGoalProgress('caffeine')}
              icon="flash"
            />
          </View>
          <View style={styles.statRow}>
            <StatCard
              title="Water"
              value={Math.round(todayStats.water / 1000 * 10) / 10}
              unit="L"
              color={['#3b82f6', '#2563eb']}
              progress={getGoalProgress('water')}
              icon="water"
            />
            <StatCard
              title="Drinks"
              value={todayStats.drinkCount}
              unit=""
              color={['#8b5cf6', '#7c3aed']}
              progress={todayStats.drinkCount / 8}
              icon="cafe"
            />
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          {goals.map((goal) => (
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
                      backgroundColor: goal.is_achieved ? '#10b981' : '#3b82f6'
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <LinearGradient colors={['#10b981', '#059669']} style={styles.fabGradient}>
          <Ionicons name="camera" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
});