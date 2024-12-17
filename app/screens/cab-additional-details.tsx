import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { validateField, formatters } from '../utils/validation';

type ScreenRouteProp = RouteProp<RootStackParamList, 'VisitorAdditionalDetails'>;
type ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VisitorAdditionalDetails'>;

export default function CabAdditionalDetails() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { formData: previousFormData, visitorId } = route.params;

  const [formData, setFormData] = useState<AdditionalDetailsFormData>({
    whomToMeet: '',
    department: '',
    documentType: '',
    documentUri: '',
    visitorPhotoUri: '',
    sendNotification: true,
    visitorCount: 1,
  });

  const uploadImage = async (uri: string, path: string) => {
    try {
      console.log('Starting image upload:', path);
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Generate a unique filename with original extension
      const extension = uri.split('.').pop() || 'jpg';
      const filename = `${Date.now()}.${extension}`;
      const imageRef = ref(storage, `${path}/${filename}`);
      
      // Upload the image
      console.log('Uploading to:', `${path}/${filename}`);
      const uploadResult = await uploadBytes(imageRef, blob);
      console.log('Upload successful:', uploadResult);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Download URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.documentType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let visitorPhotoUrl = '';
      let documentUrl = '';

      // Upload visitor photo if exists
      if (formData.visitorPhotoUri) {
        try {
          visitorPhotoUrl = await uploadImage(
            formData.visitorPhotoUri,
            `visitors/${visitorId}/photos`
          );
        } catch (error) {
          console.error('Error uploading visitor photo:', error);
          alert('Failed to upload visitor photo. Please try again.');
          return;
        }
      }

      // Upload document if exists
      if (formData.documentUri) {
        try {
          documentUrl = await uploadImage(
            formData.documentUri,
            `visitors/${visitorId}/documents`
          );
        } catch (error) {
          console.error('Error uploading document:', error);
          alert('Failed to upload document. Please try again.');
          return;
        }
      }

      // Update the visitor document with additional details
      const visitorRef = doc(db, 'visitors', visitorId);
      
      const checkInTime = new Date().toISOString();

      await updateDoc(visitorRef, {
        additionalDetails: {
          whomToMeet: formData.whomToMeet,
          department: formData.department,
          documentType: formData.documentType,
          visitorCount: formData.visitorCount,
          visitorPhotoUrl,
          documentUrl,
        },
        status: 'In',
        checkInTime,
        lastUpdated: checkInTime,
      });

      // Navigate to success screen with complete data
      navigation.navigate('CabSuccess', {
        formData: { 
          ...previousFormData,
          ...formData,
          visitorPhotoUrl,
          documentUrl,
        },
        visitorId,
      });
    } catch (error) {
      console.error('Error updating visitor data:', error);
      alert('Error saving visitor data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Additional Details" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        <PhotoUploadSection 
          type="visitor" 
          uri={formData.visitorPhotoUri}
          onPhotoSelected={(uri: string) => setFormData(prev => ({ 
            ...prev, 
            visitorPhotoUri: uri 
          }))}
        />

        <Counter
          label="Number of Visitors"
          count={formData.visitorCount}
          onIncrement={() => setFormData(prev => ({
            ...prev,
            visitorCount: prev.visitorCount + 1
          }))}
          onDecrement={() => setFormData(prev => ({
            ...prev,
            visitorCount: prev.visitorCount - 1
          }))}
          minValue={1}
          maxValue={10}
        />

        <VisitorForm
          formData={formData}
          setFormData={setFormData}
          renderAfter={() => formData.documentType && (
            <PhotoUploadSection 
              type="document" 
              uri={formData.documentUri}
              onPhotoSelected={(uri) => setFormData(prev => ({ 
                ...prev, 
                documentUri: uri 
              }))}
            />
          )}
        />
      </View>

      <View style={styles.footer}>
        <SubmitButton 
          onPress={handleSubmit}
          label="Submit"
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