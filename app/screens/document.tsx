// app/screens/Profile.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { SearchBar } from '../components/ui/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface VisitorDocument {
  id: string;
  visitorName: string;
  documentType: string;
  documentUrl: string;
  uploadDate: string;
  visitorId: string;
  purpose: string;
  contactNumber: string;
}

export default function Document() {
  const [documents, setDocuments] = useState<VisitorDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const visitorRef = collection(db, 'visitors');
      const q = query(visitorRef, orderBy('registrationDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const docs: VisitorDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.additionalDetails?.documentUrl) {
          docs.push({
            id: doc.id,
            visitorName: data.name,
            documentType: data.additionalDetails.documentType,
            documentUrl: data.additionalDetails.documentUrl,
            uploadDate: data.registrationDate,
            visitorId: doc.id,
            purpose: data.purposeOfVisit,
            contactNumber: data.contactNumber,
          });
        }
      });

      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.contactNumber.includes(searchQuery)
  );

  const handleViewDocument = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening document:', error);
      alert('Unable to open document');
    }
  };

  const renderDocumentCard = ({ item: doc }: { item: VisitorDocument }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.visitorInfo}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={doc.documentType.toLowerCase().includes('passport') ? 'id-card' : 'document'} 
              size={24} 
              color="#6B46C1" 
            />
          </View>
          <View>
            <Text style={styles.visitorName}>{doc.visitorName}</Text>
            <Text style={styles.documentType}>{doc.documentType}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {format(new Date(doc.uploadDate), 'dd/MM/yyyy')}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{doc.contactNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>{doc.purpose}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => handleViewDocument(doc.documentUrl)}
      >
        <Ionicons name="eye-outline" size={20} color="#fff" />
        <Text style={styles.viewButtonText}>View Document</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search documents..."
          style={styles.searchBar}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6B46C1" />
        </View>
      ) : filteredDocuments.length > 0 ? (
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="document-text" size={48} color="#9CA3AF" />
          <Text style={styles.noDocumentsText}>No documents found</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  documentType: {
    fontSize: 14,
    color: '#6B7280',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContent: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 80,
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noDocumentsText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
