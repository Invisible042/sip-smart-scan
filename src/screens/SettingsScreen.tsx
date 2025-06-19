import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color="white" />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
  </TouchableOpacity>
);

export const SettingsScreen: React.FC = () => {
  const handleSettingsPress = (setting: string) => {
    Alert.alert(
      setting,
      `${setting} settings would open here in a full app`,
      [{ text: 'OK' }]
    );
  };

  const settingsItems = [
    { 
      icon: 'notifications', 
      title: 'Notifications', 
      subtitle: 'Manage your alerts and reminders',
      action: () => handleSettingsPress('Notifications')
    },
    { 
      icon: 'trophy', 
      title: 'Daily Goals', 
      subtitle: 'Set and track your nutrition targets',
      action: () => handleSettingsPress('Daily Goals')
    },
    { 
      icon: 'fitness', 
      title: 'Health Preferences', 
      subtitle: 'Your health profile and dietary needs',
      action: () => handleSettingsPress('Health Preferences')
    },
    { 
      icon: 'shield-checkmark', 
      title: 'Privacy', 
      subtitle: 'Control your data and privacy settings',
      action: () => handleSettingsPress('Privacy')
    },
    { 
      icon: 'information-circle', 
      title: 'About', 
      subtitle: 'App version and information',
      action: () => handleSettingsPress('About')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>SnapDrink User</Text>
              <Text style={styles.profileEmail}>Track your drinks daily</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfile}>
            <Ionicons name="create" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Settings Items */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => (
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.action}
            />
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SnapDrink AI v1.0.0</Text>
          <Text style={styles.appDescription}>
            AI-powered drink analysis for better health choices
          </Text>
        </View>
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
  profileCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  editProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});