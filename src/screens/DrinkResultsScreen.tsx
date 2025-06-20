import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DrinkData } from '../types';

const { width } = Dimensions.get('window');

interface DrinkResultsScreenProps {
  drinkData: DrinkData;
  onClose: () => void;
  onConfirm: () => void;
}

export const DrinkResultsScreen: React.FC<DrinkResultsScreenProps> = ({
  drinkData,
  onClose,
  onConfirm,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate content in after a short delay
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getCalorieColor = (calories: number) => {
    if (calories < 100) return ['#6366f1', '#8b5cf6']; // Purple
    if (calories < 200) return ['#6366f1', '#8b5cf6']; // Purple
    return ['#6366f1', '#8b5cf6']; // Purple
  };

  const getSugarColor = (sugar: number) => {
    if (sugar < 10) return ['#6366f1', '#8b5cf6']; // Purple
    if (sugar < 25) return ['#6366f1', '#8b5cf6']; // Purple
    return ['#6366f1', '#8b5cf6']; // Purple
  };

  const getCaffeineColor = (caffeine: number) => {
    if (caffeine < 50) return ['#6366f1', '#8b5cf6']; // Purple
    if (caffeine < 100) return ['#6366f1', '#8b5cf6']; // Purple
    return ['#6366f1', '#8b5cf6']; // Purple
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Drink Analysis</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Drink Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: drinkData.image }} style={styles.drinkImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.drinkName}>{drinkData.name}</Text>
            </View>
          </View>

          {/* Main Calories Card */}
          <View style={styles.mainCard}>
            <LinearGradient
              colors={getCalorieColor(drinkData.calories)}
              style={styles.calorieGradient}
            >
              <View style={styles.calorieContent}>
                <View>
                  <Text style={styles.calorieValue}>{drinkData.calories}</Text>
                  <Text style={styles.calorieLabel}>calories</Text>
                </View>
                <View style={styles.calorieIcon}>
                  <Ionicons name="flame" size={32} color="white" />
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Nutrition Breakdown */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition Breakdown</Text>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <LinearGradient
                  colors={getSugarColor(drinkData.sugar)}
                  style={styles.nutritionGradient}
                >
                  <Ionicons name="nutrition" size={24} color="white" />
                  <Text style={styles.nutritionValue}>{drinkData.sugar}g</Text>
                  <Text style={styles.nutritionLabel}>Sugar</Text>
                </LinearGradient>
              </View>

              <View style={styles.nutritionCard}>
                <LinearGradient
                  colors={getCaffeineColor(drinkData.caffeine)}
                  style={styles.nutritionGradient}
                >
                  <Ionicons name="flash" size={24} color="white" />
                  <Text style={styles.nutritionValue}>{drinkData.caffeine}mg</Text>
                  <Text style={styles.nutritionLabel}>Caffeine</Text>
                </LinearGradient>
              </View>

              <View style={styles.nutritionCard}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.nutritionGradient}
                >
                  <Ionicons name="water" size={24} color="white" />
                  <Text style={styles.nutritionValue}>
                    {Math.round((drinkData.water / 1000) * 10) / 10}L
                  </Text>
                  <Text style={styles.nutritionLabel}>Water</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Health Tip */}
          <View style={styles.healthTipSection}>
            <Text style={styles.sectionTitle}>Health Insight</Text>
            <View style={styles.healthTipCard}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.healthTipGradient}
              >
                <View style={styles.healthTipHeader}>
                  <Ionicons name="bulb" size={24} color="white" />
                  <Text style={styles.healthTipTitle}>Smart Tip</Text>
                </View>
                <Text style={styles.healthTipText}>{drinkData.healthTip}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.confirmGradient}
              >
                <Ionicons name="checkmark" size={24} color="white" />
                <Text style={styles.confirmText}>Add to Today's Log</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  drinkImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  drinkName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  mainCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  calorieGradient: {
    padding: 24,
  },
  calorieContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
  },
  calorieLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  calorieIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nutritionGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  healthTipSection: {
    padding: 20,
  },
  healthTipCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  healthTipGradient: {
    padding: 20,
  },
  healthTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  healthTipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  actionSection: {
    padding: 20,
    paddingBottom: 40,
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  confirmGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
  },
  cancelText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
}); 