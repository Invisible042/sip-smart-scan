import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>About SnapDrink AI</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          SnapDrink AI provides AI-powered drink analysis for better health choices. Track your daily drinks, set goals, and get personalized health tips.
        </Text>
        <Text style={styles.contact}>Contact: support@snapdrink.ai</Text>
      </View>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  version: {
    fontSize: 18,
    color: 'white',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  contact: {
    fontSize: 16,
    color: '#10b981',
  },
}); 