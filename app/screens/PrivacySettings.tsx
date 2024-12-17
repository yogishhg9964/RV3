import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/ui/header';
import { useNavigation } from '@react-navigation/native';

export function PrivacySettings() {
  const navigation = useNavigation();
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Privacy Settings" 
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Text style={styles.settingDescription}>Allow app to access your location</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
          />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Analytics</Text>
            <Text style={styles.settingDescription}>Help improve the app by sharing usage data</Text>
          </View>
          <Switch
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 