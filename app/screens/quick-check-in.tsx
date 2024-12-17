import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/visitor';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { formatters } from '../utils/validation';
import { MaterialIcons } from '@expo/vector-icons';

type QuickCheckInNavigationProp = StackNavigationProp<RootStackParamList>;

function QuickCheckInScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewVisitorMessage, setShowNewVisitorMessage] = useState(false);
  const navigation = useNavigation<QuickCheckInNavigationProp>();

  const searchVisitor = async (phone: string) => {
    try {
      const visitorsRef = collection(db, 'visitors');
      const q = query(visitorsRef, where('contactNumber', '==', phone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      // Get the most recent visitor data
      let mostRecentVisitor = null;
      querySnapshot.forEach((doc) => {
        const visitorData = { id: doc.id, ...doc.data() };
        if (!mostRecentVisitor || visitorData.registrationDate > mostRecentVisitor.registrationDate) {
          mostRecentVisitor = visitorData;
        }
      });

      return mostRecentVisitor;
    } catch (error) {
      console.error('Error searching visitor:', error);
      throw error;
    }
  };

  const handleCheckIn = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setShowNewVisitorMessage(false);

    try {
      const visitorData = await searchVisitor(phoneNumber);
      
      if (!visitorData) {
        setShowNewVisitorMessage(true);
        return;
      }

      // Navigate to quick check-in form with pre-filled data
      navigation.navigate('QuickCheckInForm', {
        existingVisitor: visitorData
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to search visitor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRegistration = () => {
    navigation.navigate('VisitorEntry');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, showNewVisitorMessage && styles.inputError]}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(formatters.contactNumber(text));
                setShowNewVisitorMessage(false);
              }}
              placeholder="Enter your registered phone number"
              keyboardType="phone-pad"
              maxLength={10}
              autoFocus
            />
          </View>

          {showNewVisitorMessage && (
            <View style={styles.messageContainer}>
              <MaterialIcons name="info" size={20} color="#dc2626" />
              <Text style={styles.errorMessage}>
                New Visitor. Please Register First
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.checkInButton, !phoneNumber && styles.disabledButton]}
            onPress={handleCheckIn}
            disabled={!phoneNumber || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Check In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={[
              styles.registerButton,
              showNewVisitorMessage && styles.highlightedButton
            ]}
            onPress={handleNewRegistration}
          >
            <Text style={[
              styles.registerButtonText,
              showNewVisitorMessage && styles.highlightedButtonText
            ]}>
              New Registration?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  checkInButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  registerButton: {
    padding: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#dc2626',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  highlightedButton: {
    backgroundColor: '#f3f0ff',
    borderRadius: 8,
  },
  highlightedButtonText: {
    color: '#6B46C1',
    fontWeight: '700',
  },
});

export default QuickCheckInScreen; 