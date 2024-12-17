import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { validateField, validateForm, formatters } from '../utils/validation';
import { InputHint } from '../components/ui/input-hint';
import { RootStackParamList } from '../types/visitor';

type VisitorRegistrationNavigationProp = StackNavigationProp<RootStackParamList, 'VisitorRegistration'>;

interface FormErrors {
  name?: string;
  address?: string;
  contactNumber?: string;
  vehicleNumber?: string;
  purposeOfVisit?: string;
}

export function VisitorRegistration() {
  const navigation = useNavigation<VisitorRegistrationNavigationProp>();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    vehicleNumber: '',
    purposeOfVisit: '',
    typeOfVisit: 'Personal',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAndUpdateField = (field: keyof FormErrors, value: string) => {
    let formattedValue = value;
    
    // Apply formatters if needed
    if (field === 'contactNumber') {
      formattedValue = formatters.contactNumber(value);
    } else if (field === 'vehicleNumber') {
      formattedValue = formatters.vehicleNumber(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    const error = validateField(field, formattedValue);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleNext = async () => {
    // Validate only required fields
    const formErrors: FormErrors = {};
    const requiredFields = ['name', 'contactNumber']; // Removed purposeOfVisit
    
    requiredFields.forEach((field) => {
      const error = validateField(field as keyof FormErrors, formData[field as keyof typeof formData]);
      if (error) {
        formErrors[field as keyof FormErrors] = error;
      }
    });

    // Validate optional fields if they have values
    if (formData.vehicleNumber) {
      const error = validateField('vehicleNumber', formData.vehicleNumber);
      if (error) formErrors.vehicleNumber = error;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      Alert.alert(
        'Validation Error',
        'Please correct the errors before proceeding',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationTime = new Date().toISOString();

      const visitorRef = await addDoc(collection(db, 'visitors'), {
        ...formData,
        status: 'pending',
        registrationDate: registrationTime,
        checkInTime: null,
        checkOutTime: null,
        additionalDetails: {},
        lastUpdated: registrationTime,
        type: 'visitor'
      });

      navigation.navigate('VisitorAdditionalDetails', { 
        formData: {
          name: formData.name,
          address: formData.address,
          contactNumber: formData.contactNumber,
          vehicleNumber: formData.vehicleNumber,
          purposeOfVisit: formData.purposeOfVisit,
          typeOfVisit: formData.typeOfVisit,
        },
        visitorId: visitorRef.id 
      });
    } catch (error) {
      console.error('Error saving visitor data:', error);
      Alert.alert('Error', 'Failed to save visitor data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Registration</Text>
        <Text style={styles.headerSubtitle}>Please fill in the visitor details</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="person" size={20} color="#6B46C1" />
            <Text style={styles.label}>Name of Visitor *</Text>
          </View>
          <TextInput
            value={formData.name}
            onChangeText={(text) => validateAndUpdateField('name', text)}
            placeholder="Enter visitor name"
            style={[
              styles.input,
              errors.name ? styles.inputError : null
            ]}
          />
          <InputHint hint="Enter full name using only letters and spaces (2-50 characters)" />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="location-on" size={20} color="#6B46C1" />
            <Text style={styles.label}>Address *</Text>
          </View>
          <TextInput
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Enter address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="phone" size={20} color="#6B46C1" />
            <Text style={styles.label}>Contact Number *</Text>
          </View>
          <TextInput
            value={formData.contactNumber}
            onChangeText={(text) => {
              const formatted = formatters.contactNumber(text);
              validateAndUpdateField('contactNumber', formatted);
            }}
            onBlur={() => validateField('contactNumber', formData.contactNumber)}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            style={[
              styles.input,
              errors.contactNumber ? styles.inputError : null
            ]}
            maxLength={10}
          />
          <InputHint hint="Enter a valid 10-digit mobile number" />
          {errors.contactNumber && (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="directions-car" size={20} color="#6B46C1" />
            <Text style={styles.label}>Vehicle Number </Text>
          </View>
          <TextInput
            value={formData.vehicleNumber}
            onChangeText={(text) => {
              const formatted = formatters.vehicleNumber(text);
              validateAndUpdateField('vehicleNumber', formatted);
            }}
            onBlur={() => validateField('vehicleNumber', formData.vehicleNumber)}
            placeholder="Enter vehicle number (e.g., KA01AB1234)"
            style={[
              styles.input,
              errors.vehicleNumber ? styles.inputError : null
            ]}
            autoCapitalize="characters"
            maxLength={12}
          />
          <InputHint hint="Format: KA01AB1234 " />
          {errors.vehicleNumber && (
            <Text style={styles.errorText}>{errors.vehicleNumber}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="description" size={20} color="#6B46C1" />
            <Text style={styles.label}>Purpose of Visit*</Text>
          </View>
          <TextInput
            value={formData.purposeOfVisit}
            onChangeText={(text) => setFormData(prev => ({ ...prev, purposeOfVisit: text }))}
            placeholder="Enter purpose of visit"
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[
          styles.nextButton, 
          (!formData.name || !formData.contactNumber) && styles.disabledButton
        ]}
        onPress={handleNext}
        disabled={!formData.name || !formData.contactNumber || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.nextButtonText}>Next</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  nextButton: {
    backgroundColor: '#6B46C1',
    margin: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 