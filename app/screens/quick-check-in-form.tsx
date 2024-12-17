import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/visitor';
import { Header } from '../components/ui/header';
import { Dropdown } from '../components/ui/dropdown';
import { Counter } from '../components/ui/counter';
import { SubmitButton } from '../components/ui/submit-button';
import { departments, getStaffByDepartment } from '../constants/visitor-data';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type QuickCheckInFormRouteProp = RouteProp<RootStackParamList, 'QuickCheckInForm'>;
type QuickCheckInFormNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuickCheckInForm'
>;

export default function QuickCheckInForm() {
  const route = useRoute<QuickCheckInFormRouteProp>();
  const navigation = useNavigation<QuickCheckInFormNavigationProp>();
  const { existingVisitor } = route.params;

  const [formData, setFormData] = useState({
    whomToMeet: '',
    department: '',
    purposeOfVisit: '',
    visitorCount: 1,
  });

  // Get staff options based on selected department
  const staffOptions = useMemo(() => {
    if (!formData.department) return [];
    return getStaffByDepartment(formData.department);
  }, [formData.department]);

  const createVisitorLog = async (checkInTime: string) => {
    try {
      await addDoc(collection(db, 'visitorLogs'), {
        visitorId: existingVisitor.id,
        name: existingVisitor.name,
        contactNumber: existingVisitor.contactNumber,
        whomToMeet: formData.whomToMeet,
        department: formData.department,
        purposeOfVisit: formData.purposeOfVisit,
        checkInTime: checkInTime,
        checkOutTime: null,
        status: 'In',
        visitorCount: formData.visitorCount,
        type: 'Quick Check-In',
        documentUrl: existingVisitor.additionalDetails?.documentUrl || '',
        visitorPhotoUrl: existingVisitor.additionalDetails?.visitorPhotoUrl || '',
      });
    } catch (error) {
      console.error('Error creating visitor log:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.whomToMeet || !formData.department || !formData.purposeOfVisit) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    try {
      const visitorRef = doc(db, 'visitors', existingVisitor.id);
      const checkInTime = new Date().toISOString();

      const updatedData = {
        additionalDetails: {
          whomToMeet: formData.whomToMeet,
          department: formData.department,
          visitorCount: formData.visitorCount,
          documentType: existingVisitor.additionalDetails?.documentType || '',
          visitorPhotoUrl: existingVisitor.additionalDetails?.visitorPhotoUrl || '',
          documentUrl: existingVisitor.additionalDetails?.documentUrl || '',
        },
        purposeOfVisit: formData.purposeOfVisit,
        status: 'In',
        checkInTime,
        lastUpdated: checkInTime,
        lastCheckIn: checkInTime,
      };

      // Update visitor record
      await updateDoc(visitorRef, updatedData);

      // Create visitor log entry
      await createVisitorLog(checkInTime);

      // Navigate to success screen with combined data
      const successData = {
        ...existingVisitor,
        ...formData,
        documentType: existingVisitor.additionalDetails?.documentType || '',
        visitorPhotoUrl: existingVisitor.additionalDetails?.visitorPhotoUrl || '',
        documentUrl: existingVisitor.additionalDetails?.documentUrl || '',
        documentUri: '',
        visitorPhotoUri: '',
        sendNotification: false,
        typeOfVisit: 'Quick Check-In'
      };

      navigation.reset({
        index: 0,
        routes: [
          { 
            name: 'VisitorSuccess',
            params: {
              formData: successData,
              visitorId: existingVisitor.id
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error updating visitor:', error);
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Quick Check-In" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        <View style={styles.visitorDetailsSection}>
          <Text style={styles.sectionTitle}>Visitor Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={20} color="#6B46C1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{existingVisitor.name}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="phone" size={20} color="#6B46C1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Contact</Text>
              <Text style={styles.detailValue}>{existingVisitor.contactNumber}</Text>
            </View>
          </View>

          {existingVisitor.address && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="location-on" size={20} color="#6B46C1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{existingVisitor.address}</Text>
              </View>
            </View>
          )}

          {existingVisitor.additionalDetails?.documentType && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="description" size={20} color="#6B46C1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>ID Type</Text>
                <Text style={styles.detailValue}>{existingVisitor.additionalDetails.documentType}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Check-in Details</Text>
          
          <Dropdown
            value={formData.department}
            onValueChange={(value) => {
              setFormData(prev => ({ 
                ...prev, 
                department: value,
                whomToMeet: '' // Reset whomToMeet when department changes
              }));
            }}
            options={departments}
            placeholder="Department *"
            icon="business"
          />

          <Dropdown
            value={formData.whomToMeet}
            onValueChange={(value) => setFormData(prev => ({ ...prev, whomToMeet: value }))}
            options={staffOptions}
            placeholder="Whom to Meet *"
            icon="person-pin"
            disabled={!formData.department}
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <Ionicons name="document-text" size={20} color="#6B46C1" />
              <TextInput
                style={styles.input}
                value={formData.purposeOfVisit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, purposeOfVisit: text }))}
                placeholder="Purpose of Visit *"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Counter
            label="Number of Visitors"
            count={formData.visitorCount}
            onIncrement={() => setFormData(prev => ({
              ...prev,
              visitorCount: Math.min(prev.visitorCount + 1, 10)
            }))}
            onDecrement={() => setFormData(prev => ({
              ...prev,
              visitorCount: Math.max(prev.visitorCount - 1, 1)
            }))}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SubmitButton onPress={handleSubmit} label="Check In" />
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
    flex: 1,
    padding: 16,
  },
  visitorDetailsSection: {
    backgroundColor: '#f8f4ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
  formSection: {
    gap: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
  },
}); 