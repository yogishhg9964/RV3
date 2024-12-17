import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VisitorLogStackParamList, VisitorDetailsRouteProp } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { format } from 'date-fns';
import { Header } from '../components/ui/header';

type VisitorDetailsScreenNavigationProp = StackNavigationProp<VisitorLogStackParamList, 'VisitorDetails'>;

export function VisitorDetails() {
  const navigation = useNavigation<VisitorDetailsScreenNavigationProp>();
  const route = useRoute<VisitorDetailsRouteProp>();
  const { visitorId } = route.params;
  const [visitor, setVisitor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisitorDetails = async () => {
    try {
      if (!visitorId) {
        throw new Error('No visitor ID provided');
      }

      const visitorRef = doc(db, 'visitors', visitorId);
      const visitorDoc = await getDoc(visitorRef);
      
      if (!visitorDoc.exists()) {
        throw new Error('Visitor not found');
      }

      setVisitor({ id: visitorDoc.id, ...visitorDoc.data() });
    } catch (error) {
      console.error('Error fetching visitor details:', error);
      Alert.alert('Error', 'Failed to load visitor details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorDetails();
  }, [visitorId]);

  const handleCheckOut = async () => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const checkOutTime = new Date().toISOString();
      
      await updateDoc(visitorRef, {
        status: 'Out',
        checkOutTime,
        lastUpdated: checkOutTime,
      });

      Alert.alert('Success', 'Visitor checked out successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      console.error('Error checking out visitor:', error);
      Alert.alert('Error', 'Failed to check out visitor');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Visitor Details" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!visitor) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Visitor Details" onBack={() => navigation.goBack()} />
        <View style={styles.centerContent}>
          <Text>Visitor not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Visitor Details" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content}>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={20} color="#6B46C1" />
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{visitor.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call" size={20} color="#6B46C1" />
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{visitor.contactNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#6B46C1" />
            <Text style={styles.detailLabel}>Check In:</Text>
            <Text style={styles.detailValue}>
              {visitor.checkInTime ? format(new Date(visitor.checkInTime), 'dd/MM/yyyy hh:mm a') : 'Not checked in'}
            </Text>
          </View>

          {visitor.checkOutTime && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#6B46C1" />
              <Text style={styles.detailLabel}>Check Out:</Text>
              <Text style={styles.detailValue}>
                {format(new Date(visitor.checkOutTime), 'dd/MM/yyyy hh:mm a')}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color="#6B46C1" />
            <Text style={styles.detailLabel}>Purpose:</Text>
            <Text style={styles.detailValue}>{visitor.purposeOfVisit}</Text>
          </View>

          {visitor.additionalDetails?.whomToMeet && (
            <View style={styles.detailRow}>
              <Ionicons name="person" size={20} color="#6B46C1" />
              <Text style={styles.detailLabel}>Meeting:</Text>
              <Text style={styles.detailValue}>{visitor.additionalDetails.whomToMeet}</Text>
            </View>
          )}

          {visitor.additionalDetails?.department && (
            <View style={styles.detailRow}>
              <Ionicons name="business" size={20} color="#6B46C1" />
              <Text style={styles.detailLabel}>Department:</Text>
              <Text style={styles.detailValue}>{visitor.additionalDetails.department}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {visitor.status === 'In' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.checkOutButton}
            onPress={() => {
              Alert.alert(
                'Confirm Check Out',
                'Are you sure you want to check out this visitor?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Check Out', onPress: handleCheckOut }
                ]
              );
            }}
          >
            <Ionicons name="exit-outline" size={24} color="#fff" />
            <Text style={styles.checkOutButtonText}>Check Out Visitor</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 