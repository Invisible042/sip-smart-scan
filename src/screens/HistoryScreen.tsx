import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { DrinkAnalysisService } from '../services/DrinkAnalysisService';
import { DrinkData } from '../types';

interface DrinkItemProps {
  drink: DrinkData;
}

const DrinkItem: React.FC<DrinkItemProps> = ({ drink }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.drinkItem}>
      <View style={styles.drinkHeader}>
        <View style={styles.drinkInfo}>
          <Text style={styles.drinkName}>{drink.name}</Text>
          <Text style={styles.drinkTime}>{formatTime(drink.timestamp)}</Text>
        </View>
        <View style={styles.caloriesChip}>
          <Text style={styles.calories}>{drink.calories} cal</Text>
        </View>
      </View>

      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <Ionicons name="nutrition" size={16} color="#ef4444" />
          <Text style={styles.nutritionValue}>{drink.sugar}g</Text>
          <Text style={styles.nutritionLabel}>Sugar</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Ionicons name="flash" size={16} color="#f59e0b" />
          <Text style={styles.nutritionValue}>{drink.caffeine || 0}mg</Text>
          <Text style={styles.nutritionLabel}>Caffeine</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Ionicons name="water" size={16} color="#3b82f6" />
          <Text style={styles.nutritionValue}>
            {Math.round(((drink.water || 0) / 1000) * 10) / 10}L
          </Text>
          <Text style={styles.nutritionLabel}>Water</Text>
        </View>
      </View>

      {drink.healthTip && (
        <View style={styles.healthTip}>
          <Ionicons
            name="bulb"
            size={16}
            color="#10b981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.healthTipText}>{drink.healthTip}</Text>
        </View>
      )}
    </View>
  );
};

export const HistoryScreen: React.FC = () => {
  const [drinks, setDrinks] = useState<DrinkData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDrinks();
  }, []);

  const loadDrinks = async () => {
    try {
      const drinkHistory = await DrinkAnalysisService.getDrinksFromStorage();
      setDrinks(drinkHistory);
    } catch (error) {
      console.error('Error loading drinks:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrinks();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Drink History</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {drinks.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.emptyIcon}
            >
              <Ionicons name="list" size={48} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No drinks scanned yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by scanning your first drink!
            </Text>
          </View>
        ) : (
          drinks.map((drink, index) => (
            <DrinkItem key={`${drink.id}-${index}`} drink={drink} />
          ))
        )}
      </ScrollView>
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
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  drinkItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  drinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  drinkTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  caloriesChip: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  healthTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  healthTipText: {
    flex: 1,
    fontSize: 14,
    color: '#10b981',
    lineHeight: 20,
  },
});
