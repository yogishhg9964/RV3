import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdditionalDetailsFormData, RootStackParamList } from '../types/visitor';
import { Header } from '../components/ui/header';
import { PhotoUploadSection } from '../components/visitor/photo-upload-section';
import { VisitorForm } from '../components/visitor/visitor-form';
import { SubmitButton } from '../components/ui/submit-button';
import { Counter } from '../components/ui/counter';
import { db, storage } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type ScreenRouteProp = RouteProp<RootStackParamList, 'VisitorAdditionalDetails'>;
type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export function VisitorAdditionalDetails() {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { formData: previousFormData, visitorId } = route.params;
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<AdditionalDetailsFormData>({
    
    department: '',
    whomToMeet: '',
    documentType: '',
    documentUri: '',
    visitorPhotoUri: '',
    sendNotification: true,
    visitorCount: 1,
  });

  const uploadImage = async (uri: string, path: string): Promise<string> => {
    try {
      if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
        throw new Error('Invalid image URI');
      }

      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      if (!blob) {
        throw new Error('Failed to create blob');
      }

      const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
      const imageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = await uploadBytes(imageRef, blob);
      if (!uploadTask) {
        throw new Error('Upload failed');
      }

      const downloadURL = await getDownloadURL(imageRef);
      if (!downloadURL) {
        throw new Error('Failed to get download URL');
      }

      return downloadURL;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.documentType) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      let visitorPhotoUrl = '';
      let documentUrl = '';

      if (formData.visitorPhotoUri) {
        try {
          visitorPhotoUrl = await uploadImage(
            formData.visitorPhotoUri,
            `visitors/${visitorId}/photos`
          );
        } catch (error) {
          setIsUploading(false);
          Alert.alert(
            'Upload Error',
            'Failed to upload visitor photo. Please try again.'
          );
          return;
        }
      }

      if (formData.documentUri) {
        try {
          documentUrl = await uploadImage(
            formData.documentUri,
            `visitors/${visitorId}/documents`
          );
        } catch (error) {
          setIsUploading(false);
          Alert.alert(
            'Upload Error',
            'Failed to upload document. Please try again.'
          );
          return;
        }
      }

      const visitorRef = doc(db, 'visitors', visitorId);
      const checkInTime = new Date().toISOString();

      const updateData = {
        additionalDetails: {
          whomToMeet: formData.whomToMeet,
          department: formData.department,
          documentType: formData.documentType,
          visitorCount: formData.visitorCount,
          visitorPhotoUrl,
          documentUrl,
          checkInTime,
        },
        status: 'In',
        checkInTime,
        lastUpdated: checkInTime,
        type: 'visitor',
      };

      await updateDoc(visitorRef, updateData);

      navigation.navigate('VisitorSuccess', {
        formData: {
          ...previousFormData,
          ...formData,
          visitorPhotoUrl,
          documentUrl,
        },
        visitorId,
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert(
        'Error',
        'Failed to complete registration. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Additional Details" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <PhotoUploadSection 
          type="visitor" 
          uri={formData.visitorPhotoUri}
          onPhotoSelected={(uri: string) => {
            console.log('Visitor photo selected:', uri);
            setFormData(prev => ({ 
              ...prev, 
              visitorPhotoUri: uri 
            }));
          }}
        />

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

        <VisitorForm
          formData={formData}
          setFormData={setFormData}
          renderAfter={() => formData.documentType && (
            <PhotoUploadSection 
              type="document" 
              uri={formData.documentUri}
              onPhotoSelected={(uri) => {
                console.log('Document photo selected:', uri);
                setFormData(prev => ({ 
                  ...prev, 
                  documentUri: uri 
                }));
              }}
            />
          )}
        />
      </View>

      <View style={styles.footer}>
        <SubmitButton 
          onPress={handleSubmit}
          label={isUploading ? "Uploading..." : "Submit"}
          disabled={isUploading}
        />
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
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
}); 