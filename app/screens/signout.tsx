// app/screens/SignOut.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { auth} from '../../FirebaseConfig';
import {signOut} from 'firebase/auth';
import { Alert } from 'react-native';

export default function SignOut() {
  const navigation = useNavigation();

  const handleSignout = async () => {
    await signOut(auth);
    Alert.alert('Logged out');
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
        <Text style={styles.headerTitle}>Sign Out</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="log-out-outline" size={80} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.title}>Sign Out</Text>
        <Text style={styles.message}>
          Are you sure you want to sign out from your account?
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignout}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
