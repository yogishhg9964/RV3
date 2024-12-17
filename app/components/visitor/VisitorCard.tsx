import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VisitorLogStackParamList } from '../../types/navigation';

type VisitorCardNavigationProp = StackNavigationProp<VisitorLogStackParamList, 'VisitorLog'>;

interface VisitorCardProps {
  visitor: {
    id: string;
    name: string;
    checkInTime: string;
    checkOutTime: string | null;
    purpose: string;
    whomToMeet: string;
    department: string;
    status: 'In' | 'Out' | 'pending';
    contactNumber: string;
    type: string;
    additionalDetails: any;
  };
  onCheckOut: (visitorId: string) => void;
}

export function VisitorCard({ visitor, onCheckOut }: VisitorCardProps) {
  const navigation = useNavigation<VisitorCardNavigationProp>();

  const handlePress = () => {
    if (!visitor.id) {
      console.error('No visitor ID');
      return;
    }
    
    navigation.navigate('VisitorDetails', {
      visitorId: visitor.id
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`visitor-card-${visitor.id}`}
    >
      <View style={styles.cardHeader}>
        <View style={styles.visitorInfo}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={visitor.type === 'cab' ? 'car' : 'person'} 
              size={24} 
              color="#6B46C1" 
            />
          </View>
          <View>
            <Text style={styles.visitorName}>{visitor.name}</Text>
            <Text style={styles.visitorContact}>{visitor.contactNumber}</Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          visitor.status === 'In' ? styles.statusIn : 
          visitor.status === 'Out' ? styles.statusOut :
          styles.statusPending
        ]}>
          <Text style={[
            styles.statusText,
            { color: visitor.status === 'In' ? '#15803D' : 
                     visitor.status === 'Out' ? '#B91C1C' : 
                     '#B45309' }
          ]}>
            {visitor.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailColumn}>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#6B46C1" />
            <Text style={styles.detailLabel}>Check In:</Text>
            <Text style={styles.detailValue}>
              {visitor.checkInTime ? format(new Date(visitor.checkInTime), 'hh:mm a') : 'Not checked in'}
            </Text>
          </View>

          {visitor.checkOutTime && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#6B46C1" />
              <Text style={styles.detailLabel}>Check Out:</Text>
              <Text style={styles.detailValue}>
                {format(new Date(visitor.checkOutTime), 'hh:mm a')}
              </Text>
            </View>
          )}

          {visitor.whomToMeet && (
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color="#6B46C1" />
              <Text style={styles.detailLabel}>Meeting:</Text>
              <Text style={styles.detailValue}>{visitor.whomToMeet}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailColumn}>
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#6B46C1" />
            <Text style={styles.detailLabel}>Purpose:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{visitor.purpose}</Text>
          </View>

          {visitor.department && (
            <View style={styles.detailRow}>
              <Ionicons name="business" size={16} color="#6B46C1" />
              <Text style={styles.detailLabel}>Dept:</Text>
              <Text style={styles.detailValue}>{visitor.department}</Text>
            </View>
          )}
        </View>
      </View>

      {visitor.status === 'In' && (
        <TouchableOpacity 
          style={styles.checkOutButton}
          onPress={() => onCheckOut(visitor.id)}
        >
          <Ionicons name="exit-outline" size={20} color="#fff" />
          <Text style={styles.checkOutButtonText}>Check Out</Text>
        </TouchableOpacity>
      )}

      {visitor.status === 'Out' && visitor.checkOutTime && (
        <View style={styles.checkOutInfo}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.checkOutTimeText}>
            Checked out at {format(new Date(visitor.checkOutTime), 'hh:mm a')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailColumn: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  checkOutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  checkOutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
  },
  checkOutTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 