import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs,getDoc, orderBy, doc, updateDoc} from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { SearchBar } from '../components/ui/SearchBar';
import { VisitorCard } from '../components/visitor/VisitorCard';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import { Colors } from '@/constants/Colors';

interface Visitor {
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
  additionalDetails: any;
}

export default function TodaysVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    fetchVisitors(selectedDate);
  }, [selectedDate]);

  const fetchVisitors = async (date: Date) => {
    try {
      setIsLoading(true);
      const start = startOfDay(date);
      const end = endOfDay(date);

      const visitorRef = collection(db, 'visitors');
      const q = query(
        visitorRef,
        where('checkInTime', '>=', start.toISOString()),
        where('checkInTime', '<=', end.toISOString()),
        orderBy('checkInTime', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const visitorData: Visitor[] = [];

      querySnapshot.forEach((doc) => {
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
          additionalDetails: data.additionalDetails || {}
        });
      });

      setVisitors(visitorData);
      setFilteredVisitors(visitorData);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = [...visitors];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(visitor => 
        visitor.name.toLowerCase().includes(query) ||
        visitor.contactNumber.includes(query) ||
        visitor.whomToMeet.toLowerCase().includes(query) ||
        visitor.department.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(visitor => 
        selectedStatus.includes(visitor.status)
      );
    }

    setFilteredVisitors(filtered);
  }, [searchQuery, visitors, selectedStatus]);

  const renderVisitorCard = ({ item: visitor }: { item: Visitor }) => (
    <VisitorCard 
      visitor={visitor}
      onCheckOut={handleCheckOut}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search visitors..."
              style={styles.searchBar}
            />
          </View>
          
          <TouchableOpacity 
  style={styles.dateSelector}
  onPress={() => setShowCalendar(true)}
  activeOpacity={0.7}
>
  <View style={styles.dateSelectorContent}>
    <Ionicons name="calendar" size={20} color={Colors.PRIMARY} />
    <Text style={styles.dateText}>
      {format(selectedDate, 'MMMM dd, yyyy')}
    </Text>
    <Ionicons name="chevron-down" size={20} color={Colors.PRIMARY} />
  </View>
</TouchableOpacity>
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
            <Text style={styles.noVisitorsText}>
              {searchQuery ? 'No matching visitors found' : 'No visitors found for selected date'}
            </Text>
          </View>
        )}
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <CalendarPicker
              onDateChange={(date) => {
                setSelectedDate(new Date(date as Date));
                setShowCalendar(false);
              }}
              selectedStartDate={selectedDate}
              width={300}
              selectedDayColor={Colors.PRIMARY}
              selectedDayTextColor="#FFFFFF"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
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
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dateSelector: {
    marginTop: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  dateSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
});
