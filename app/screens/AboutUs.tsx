import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

export default function AboutUs() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      <View style={styles.content}>
        {/* Logo or Image */}
        <View style={styles.logoContainer}>
          <Ionicons name="school-outline" size={80} color={Colors.PRIMARY} />
        </View>

        {/* Main Content */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>RVCE Visitor Management System</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            RVCE Visitor Management System is designed to streamline and secure the visitor entry process at RV College of Engineering. Our system provides efficient management of campus visitors while ensuring the safety and security of students and staff.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>Email: contact@rvce.edu.in</Text>
          <Text style={styles.contactText}>Phone: +91 80 2861 2445/2861 2444</Text>
          <Text style={styles.contactText}>
            Address: RV Vidyaniketan Post, 8th Mile, Mysuru Road, Bengaluru - 560059
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
  },
  contactInfo: {
    marginTop: 'auto',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
}); 