import { storage } from '../../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

export async function uploadImage(uri: string, path: string): Promise<string> {
  try {
    console.log('Starting upload for:', uri);
    
    // Read the file
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Read file content
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate unique filename
    const extension = uri.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const fullPath = `${path}/${filename}`;
    
    console.log('Uploading to path:', fullPath);
    const storageRef = ref(storage, fullPath);

    // Upload blob
    await uploadBytes(storageRef, blob);
    console.log('Upload completed');

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function uploadDocument(uri: string, visitorId: string): Promise<string> {
  try {
    return await uploadImage(uri, `visitors/${visitorId}/documents`);
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

export async function uploadVisitorPhoto(uri: string, visitorId: string): Promise<string> {
  try {
    return await uploadImage(uri, `visitors/${visitorId}/photos`);
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
} 