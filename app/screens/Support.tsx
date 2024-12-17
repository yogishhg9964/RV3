import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/ui/header';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export function Support() {
  const navigation = useNavigation();

  const supportOptions = [
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: 'mail-outline',
      onPress: () => Linking.openURL('mailto:support@example.com'),
    },
    {
      id: 'faq',
      title: 'FAQs',
      description: 'Find answers to common questions',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Help us improve the app',
      icon: 'chatbubble-outline',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Help & Support" 
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        {supportOptions.map(option => (
          <TouchableOpacity 
            key={option.id}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={styles.optionIcon}>
              <Ionicons name={option.icon} size={24} color={Colors.PRIMARY} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 