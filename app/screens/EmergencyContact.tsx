import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

export default function EmergencyContact() {
  const navigation = useNavigation();

  const emergencyContacts = [
    { 
      id: 1,
      name: 'Campus Security',
      number: '+91 1234567890',
      icon: 'shield-outline',
      description: '24/7 Campus Security Service'
    },
    { 
      id: 2,
      name: 'Medical Emergency',
      number: '+91 9876543210',
      icon: 'medical-outline',
      description: 'Campus Medical Center'
    },
    { 
      id: 3,
      name: 'Fire Emergency',
      number: '101',
      icon: 'flame-outline',
      description: 'Fire Department'
    },
    { 
      id: 4,
      name: 'Police',
      number: '100',
      icon: 'warning-outline',
      description: 'Local Police Station'
    }
  ] as const;

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          In case of emergency, please contact the following numbers:
        </Text>

        {emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleCall(contact.number)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={contact.icon as keyof typeof Ionicons.glyphMap} size={24} color={Colors.PRIMARY} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <View style={styles.callButton}>
              <Ionicons name="call" size={24} color="#fff" />
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 