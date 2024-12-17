import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/visitor';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface Props {
  route: RouteProp<RootStackParamList, 'VisitorSuccess'>;
}

type SuccessNavigationProp = StackNavigationProp<RootStackParamList>;

export function VisitorSuccess({ route }: Props) {
  const { formData, visitorId } = route.params;
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isSendingEmail, setSendingEmail] = useState(false);
  const navigation = useNavigation<SuccessNavigationProp>();
  const qrCodeRef = useRef<any>(null);

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    visitorId,
    name: formData.name,
    email: formData.email,
    timestamp: new Date().toISOString(),
  });

  const shareQRCode = async () => {
    if (isSendingEmail) return;

    try {
      setSendingEmail(true);

      // Generate QR code as base64
      const qrBase64 = await new Promise((resolve, reject) => {
        qrCodeRef.current?.toDataURL((dataURL: string) => {
          try {
            resolve(dataURL);
          } catch (error) {
            reject('Failed to generate QR code');
          }
        });
      });

      // Save QR code temporarily
      const tempQrPath = `${FileSystem.cacheDirectory}visitor_qr.png`;
      const qrData = qrBase64.replace('data:image/png;base64,', '');
      await FileSystem.writeAsStringAsync(tempQrPath, qrData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Share the QR code
      await Sharing.shareAsync(tempQrPath, {
        mimeType: 'image/png',
        dialogTitle: 'Share QR Code',
        UTI: 'public.png' // for iOS
      });

    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share the QR code. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    fetchVisitorData();
    if (formData.email) {
      shareQRCode();
    }
  }, []);

  const fetchVisitorData = async () => {
    try {
      const visitorRef = doc(db, 'visitors', visitorId);
      const visitorDoc = await getDoc(visitorRef);
      if (visitorDoc.exists()) {
        const data = visitorDoc.data();
        if (data.checkInTime) {
          setCheckInTime(data.checkInTime);
        }
      }
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.title}>Check-In Successful!</Text>
          <Text style={styles.subtitle}>Your QR code is ready</Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrCodeData}
              size={200}
              getRef={(c) => (qrCodeRef.current = c)}
            />
            <Text style={styles.qrLabel}>Visitor ID: {visitorId}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <DetailRow label="Name" value={formData.name} />
            <DetailRow label="Contact" value={formData.contactNumber} />
            <DetailRow label="Purpose" value={formData.purposeOfVisit} />
            <DetailRow label="Department" value={formData.department} />
            <DetailRow label="Meeting With" value={formData.whomToMeet} />
            {checkInTime && (
              <DetailRow 
                label="Check-In Time" 
                value={formatDate(checkInTime)}
              />
            )}
          </View>

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={shareQRCode}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={24} color="#fff" style={styles.shareIcon} />
            <Text style={styles.shareButtonText}>Share QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={24} color="#fff" style={styles.homeIcon} />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#6B46C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeIcon: {
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareIcon: {
    marginRight: 8,
  },
}); 