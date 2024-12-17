import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterSidebar } from './components/FilterSideBar';
import { collection, query, orderBy, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { VisitorCard } from '../components/visitor/VisitorCard';

interface VisitorLogData {
  id: string;
  name: string;
  checkInTime: string;
  checkOutTime: string | null;
  purpose: string;
  whomToMeet: string;
  department: string;
  status: 'In' | 'Out' | 'pending';
  contactNumber: string;
  visitorPhotoUrl?: string;
  documentUrl?: string;
  type: string;
  lastUpdated?: string;
  additionalDetails: any;
}

export default function VisitorLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visitors, setVisitors] = useState<VisitorLogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [] as string[],
    department: [] as string[],
    sortBy: null,
    sortOrder: 'asc' as const,
  });

  useEffect(() => {
    setIsLoading(true);
    
    const visitorRef = collection(db, 'visitors');
    const q = query(
      visitorRef,
      orderBy('lastUpdated', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const visitorData: VisitorLogData[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          visitorData.push({
            id: doc.id,
            name: data.name || '',
            checkInTime: data.checkInTime || '',
            checkOutTime: data.checkOutTime || null,
            purpose: data.purposeOfVisit || '',
            whomToMeet: data.additionalDetails?.whomToMeet || '',
            department: data.additionalDetails?.department || '',
            status: data.status || 'pending',
            contactNumber: data.contactNumber || '',
            visitorPhotoUrl: data.additionalDetails?.visitorPhotoUrl || '',
            documentUrl: data.additionalDetails?.documentUrl || '',
            type: data.type || 'visitor',
            lastUpdated: data.lastUpdated || data.checkInTime || '',
            additionalDetails: data.additionalDetails || {}
          });
        });

        setVisitors(visitorData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching visitors:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Failed to fetch visitor data');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCheckOut = async (visitorId: string) => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const checkOutTime = new Date().toISOString();
      
      const visitorDoc = await getDoc(visitorRef);
      if (!visitorDoc.exists()) {
        throw new Error('Visitor not found');
      }

      const visitorData = visitorDoc.data();
      
      const updateData = {
        status: 'Out',
        checkOutTime: checkOutTime,
        lastUpdated: checkOutTime,
        additionalDetails: {
          ...(visitorData.additionalDetails || {}),
          checkOutTime: checkOutTime
        }
      };

      await updateDoc(visitorRef, updateData);
      Alert.alert('Success', 'Visitor checked out successfully');

    } catch (error) {
      console.error('Error checking out visitor:', error);
      Alert.alert('Error', 'Failed to check out visitor. Please try again.');
    }
  };

  const renderVisitorCard = ({ item: visitor }: { item: VisitorLogData }) => (
    <VisitorCard 
      visitor={visitor}
      onCheckOut={handleCheckOut}
    />
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
      ) : visitors.length > 0 ? (
        <FlatList
          data={visitors}
          renderItem={renderVisitorCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.noVisitorsText}>No visitors found</Text>
        </View>
      )}

      <FilterSidebar
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />
    </SafeAreaView>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  noVisitorsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
});
