// app/screens/Profile.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, onSnapshot, orderBy, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { SearchBar } from './components/SearchBar';
import { Ionicons } from '@expo/vector-icons';

interface Visitor {
  id: string;
  name: string;
  contactNumber: string;
  whomToMeet: string;
  department: string;
  purposeOfVisit: string;
  checkInTime: any;
  checkOutTime: any | null;
  status: 'In' | 'Out';
  visitorPhotoUrl?: string;
  type: string;
}

function formatTime(time: any): string {
  if (!time) return 'N/A';
  
  try {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
}

export default function TodaysVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        // Get today's start timestamp
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's start timestamp
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log('Fetching visitors between:', today.toISOString(), 'and', tomorrow.toISOString());

        // Reference to visitors collection
        const visitorsRef = collection(db, 'visitorLogs');
        
        // Create query for today's visitors
        const q = query(
          visitorsRef,
          where('checkInTime', '>=', today.toISOString()),
          where('checkInTime', '<', tomorrow.toISOString())
        );

        // Set up real-time listener
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const visitorData: Visitor[] = [];
            const seenIds = new Set(); // To prevent duplicates

            snapshot.forEach((doc) => {
              const data = doc.data();
              
              // Skip if we've already seen this ID
              if (seenIds.has(doc.id)) return;
              seenIds.add(doc.id);

              // Only add if it's a valid visitor entry
              if (data.name && data.checkInTime) {
                visitorData.push({
                  id: doc.id,
                  name: data.name,
                  contactNumber: data.contactNumber || '',
                  whomToMeet: data.whomToMeet || '',
                  department: data.department || '',
                  purposeOfVisit: data.purposeOfVisit || '',
                  checkInTime: data.checkInTime,
                  checkOutTime: data.checkOutTime || null,
                  status: data.status || 'In',
                  visitorPhotoUrl: data.visitorPhotoUrl || '',
                  type: data.type || 'visitor'
                });
              }
            });
            
            // Sort by check-in time in descending order
            visitorData.sort((a, b) => {
              const timeA = new Date(a.checkInTime).getTime();
              const timeB = new Date(b.checkInTime).getTime();
              return timeB - timeA;
            });

            console.log('Fetched unique visitors:', visitorData.length);
            setVisitors(visitorData);
            setIsLoading(false);
          },
          (error) => {
            console.error('Error fetching visitors:', error);
            setIsLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error in fetchVisitors:', error);
        setIsLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.contactNumber.includes(searchQuery) ||
    visitor.whomToMeet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visitor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVisitorCard = ({ item: visitor }: { item: Visitor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.visitorInfo}>
          {visitor.visitorPhotoUrl ? (
            <Image 
              source={{ uri: visitor.visitorPhotoUrl }} 
              style={styles.visitorPhoto}
            />
          ) : (
            <View style={styles.visitorPhotoPlaceholder}>
              <Ionicons name="person" size={24} color="#6B46C1" />
            </View>
          )}
          <View>
            <Text style={styles.visitorName}>{visitor.name}</Text>
            <Text style={styles.visitorContact}>{visitor.contactNumber}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          visitor.status === 'In' ? styles.statusIn : styles.statusOut
        ]}>
          <Text style={[
            styles.statusText,
            { color: visitor.status === 'In' ? '#15803D' : '#B91C1C' }
          ]}>
            {visitor.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <DetailRow icon="time" label="Check In" value={formatTime(visitor.checkInTime)} />
        <DetailRow icon="business" label="Department" value={visitor.department} />
        <DetailRow icon="person" label="Meeting" value={visitor.whomToMeet} />
        <DetailRow icon="document-text" label="Purpose" value={visitor.purposeOfVisit} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search visitors..."
            style={styles.searchBar}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6B46C1" />
        </View>
      ) : filteredVisitors.length > 0 ? (
        <FlatList
          data={filteredVisitors}
          renderItem={renderVisitorCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="people" size={48} color="#9CA3AF" />
          <Text style={styles.noVisitorsText}>No visitors today</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={16} color="#6B46C1" style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visitorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  visitorPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  visitorContact: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIn: {
    backgroundColor: '#DEF7EC',
  },
  statusOut: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noVisitorsText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
