import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1e293b',
              borderTopColor: 'rgba(255,255,255,0.1)',
              paddingBottom: 8,
              paddingTop: 8,
              height: 80,
            },
            tabBarActiveTintColor: '#10b981',
            tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="History" 
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}