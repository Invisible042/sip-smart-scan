import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
  TextInput,
  Button,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useNavigation } from '@react-navigation/native';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
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
  // Modal visibility state
  const [modal, setModal] = useState<null | string>(null);

  // Notifications state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  // Daily Goals state
  const [calorieGoal, setCalorieGoal] = useState('2000');
  const [sugarGoal, setSugarGoal] = useState('30');
  const [hydrationGoal, setHydrationGoal] = useState('2000');

  // Health Preferences state
  const [vegan, setVegan] = useState(false);
  const [lowSugar, setLowSugar] = useState(false);
  const [caffeineFree, setCaffeineFree] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [highCholesterol, setHighCholesterol] = useState(false);
  const [customRestriction, setCustomRestriction] = useState('');

  const navigation = useNavigation();

  // Load settings from AsyncStorage
  useEffect(() => {
    (async () => {
      const notif = await AsyncStorage.getItem('notificationsEnabled');
      if (notif !== null) setNotificationsEnabled(JSON.parse(notif));
      const time = await AsyncStorage.getItem('reminderTime');
      if (time) setReminderTime(time);
      const cal = await AsyncStorage.getItem('calorieGoal');
      if (cal) setCalorieGoal(cal);
      const sug = await AsyncStorage.getItem('sugarGoal');
      if (sug) setSugarGoal(sug);
      const hyd = await AsyncStorage.getItem('hydrationGoal');
      if (hyd) setHydrationGoal(hyd);
      const veg = await AsyncStorage.getItem('vegan');
      if (veg !== null) setVegan(JSON.parse(veg));
      const ls = await AsyncStorage.getItem('lowSugar');
      if (ls !== null) setLowSugar(JSON.parse(ls));
      const cf = await AsyncStorage.getItem('caffeineFree');
      if (cf !== null) setCaffeineFree(JSON.parse(cf));
      const dia = await AsyncStorage.getItem('diabetes');
      if (dia !== null) setDiabetes(JSON.parse(dia));
      const htn = await AsyncStorage.getItem('hypertension');
      if (htn !== null) setHypertension(JSON.parse(htn));
      const chol = await AsyncStorage.getItem('highCholesterol');
      if (chol !== null) setHighCholesterol(JSON.parse(chol));
      const cust = await AsyncStorage.getItem('customRestriction');
      if (cust !== null) setCustomRestriction(cust);
    })();
  }, []);

  // Save settings to AsyncStorage
  const saveSetting = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  };

  const handleSettingsPress = (setting: string) => {
    setModal(setting);
  };

  const closeModal = () => setModal(null);

  // Helper: Request permissions and get push token
  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      setNotificationStatus('Must use physical device for notifications');
      return null;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      setNotificationStatus('Permission denied for notifications');
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    setExpoPushToken(tokenData.data);
    setNotificationStatus('Notifications enabled');
    return tokenData.data;
  };

  // Helper: Schedule daily notification
  const scheduleDailyNotification = async (time: string) => {
    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    const [hour, minute] = time.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SnapDrink Reminder',
        body: 'Don\'t forget to log your drinks today!',
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  };

  // Effect: When notificationsEnabled or reminderTime changes
  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          scheduleDailyNotification(reminderTime);
        }
      });
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [notificationsEnabled, reminderTime]);

  // Helper: Save all daily goals as an array in AsyncStorage
  const saveAllDailyGoals = async (newCalorie: string, newSugar: string, newHydration: string) => {
    const dailyGoals = [
      {
        id: '1',
        name: 'Daily Calories',
        type: 'calories',
        target: parseInt(newCalorie, 10) || 0,
        current: 0,
        unit: 'cal',
        is_achieved: false,
      },
      {
        id: '2',
        name: 'Sugar Intake',
        type: 'sugar',
        target: parseInt(newSugar, 10) || 0,
        current: 0,
        unit: 'g',
        is_achieved: false,
      },
      {
        id: '4',
        name: 'Water Intake',
        type: 'water',
        target: parseInt(newHydration, 10) || 0,
        current: 0,
        unit: 'ml',
        is_achieved: false,
      },
    ];
    await AsyncStorage.setItem('daily_goals', JSON.stringify(dailyGoals));

    // Save to dated history
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let historyRaw = await AsyncStorage.getItem('daily_goals_history');
    let history = historyRaw ? JSON.parse(historyRaw) : {};
    history[today] = dailyGoals;
    await AsyncStorage.setItem('daily_goals_history', JSON.stringify(history));
  };

  const settingsItems = [
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your alerts and reminders',
      action: () => handleSettingsPress('Notifications'),
    },
    {
      icon: 'trophy',
      title: 'Daily Goals',
      subtitle: 'Set and track your nutrition targets',
      action: () => handleSettingsPress('Daily Goals'),
    },
    {
      icon: 'fitness',
      title: 'Health Preferences',
      subtitle: 'Your health profile and dietary needs',
      action: () => handleSettingsPress('Health Preferences'),
    },
    {
      icon: 'shield-checkmark',
      title: 'Privacy',
      subtitle: 'Control your data and privacy settings',
      action: () => handleSettingsPress('Privacy'),
    },
    {
      icon: 'information-circle',
      title: 'About',
      subtitle: 'App version and information',
      action: () => navigation.navigate('About'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.profileCard}
        >
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

      {/* Notifications Modal */}
      <Modal visible={modal === 'Notifications'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Enable Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={async val => {
                  setNotificationsEnabled(val);
                  saveSetting('notificationsEnabled', val);
                  if (val) {
                    const token = await registerForPushNotificationsAsync();
                    if (!token) setNotificationsEnabled(false);
                  } else {
                    await Notifications.cancelAllScheduledNotificationsAsync();
                  }
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Reminder Time</Text>
              <TextInput
                style={styles.input}
                value={reminderTime}
                onChangeText={val => {
                  setReminderTime(val);
                  saveSetting('reminderTime', val);
                }}
                placeholder="08:00"
                keyboardType="numeric"
              />
            </View>
            {notificationStatus && (
              <Text style={{ color: 'orange', marginBottom: 8 }}>{notificationStatus}</Text>
            )}
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      {/* Daily Goals Modal */}
      <Modal visible={modal === 'Daily Goals'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daily Goals</Text>
            <Text style={styles.modalLabel}>Calories (kcal)</Text>
            <TextInput
              style={styles.input}
              value={calorieGoal}
              onChangeText={val => {
                setCalorieGoal(val);
                saveSetting('calorieGoal', val);
                saveAllDailyGoals(val, sugarGoal, hydrationGoal);
              }}
              keyboardType="numeric"
            />
            <Text style={styles.modalLabel}>Sugar (g)</Text>
            <TextInput
              style={styles.input}
              value={sugarGoal}
              onChangeText={val => {
                setSugarGoal(val);
                saveSetting('sugarGoal', val);
                saveAllDailyGoals(calorieGoal, val, hydrationGoal);
              }}
              keyboardType="numeric"
            />
            <Text style={styles.modalLabel}>Hydration (ml)</Text>
            <TextInput
              style={styles.input}
              value={hydrationGoal}
              onChangeText={val => {
                setHydrationGoal(val);
                saveSetting('hydrationGoal', val);
                saveAllDailyGoals(calorieGoal, sugarGoal, val);
              }}
              keyboardType="numeric"
            />
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      {/* Health Preferences Modal */}
      <Modal visible={modal === 'Health Preferences'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Health Preferences</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Vegan</Text>
              <Switch
                value={vegan}
                onValueChange={val => {
                  setVegan(val);
                  saveSetting('vegan', val);
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Low Sugar</Text>
              <Switch
                value={lowSugar}
                onValueChange={val => {
                  setLowSugar(val);
                  saveSetting('lowSugar', val);
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Caffeine Free</Text>
              <Switch
                value={caffeineFree}
                onValueChange={val => {
                  setCaffeineFree(val);
                  saveSetting('caffeineFree', val);
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Diabetes</Text>
              <Switch
                value={diabetes}
                onValueChange={val => {
                  setDiabetes(val);
                  saveSetting('diabetes', val);
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>Hypertension</Text>
              <Switch
                value={hypertension}
                onValueChange={val => {
                  setHypertension(val);
                  saveSetting('hypertension', val);
                }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.modalLabel}>High Cholesterol</Text>
              <Switch
                value={highCholesterol}
                onValueChange={val => {
                  setHighCholesterol(val);
                  saveSetting('highCholesterol', val);
                }}
              />
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.modalLabel}>Custom Dietary Restrictions</Text>
              <TextInput
                style={styles.input}
                value={customRestriction}
                onChangeText={val => {
                  setCustomRestriction(val);
                  saveSetting('customRestriction', val);
                }}
                placeholder="e.g. gluten, nuts, lactose"
              />
            </View>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
      {/* Privacy Modal */}
      <Modal visible={modal === 'Privacy'} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy</Text>
            <Button title="View Privacy Policy" onPress={() => Linking.openURL('https://your-privacy-policy-url.com')} />
            <Button title="Clear All App Data" color="red" onPress={async () => {
              await AsyncStorage.clear();
              setNotificationsEnabled(false);
              setReminderTime('08:00');
              setCalorieGoal('2000');
              setSugarGoal('30');
              setHydrationGoal('2000');
              setVegan(false);
              setLowSugar(false);
              setCaffeineFree(false);
              setDiabetes(false);
              setHypertension(false);
              setHighCholesterol(false);
              setCustomRestriction('');
              closeModal();
            }} />
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    color: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
