import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import QuickCheckIn from './quick-check-in';
import { RootStackParamList } from '../types/navigation';
import Document from './document';
import VisitorEntry from './VisitorEntry';

const HomeScreen = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const [activeSlide, setActiveSlide] = useState(0);
  
  const images = [
    {
      id: 1,
      source: require('@/assets/images/rvce-gate.jpg'),
      title: 'RVCE Main Gate'
    },
    {
      id: 2,
      source: require('@/assets/images/rvce-campus.jpg'),
      title: 'RVCE Campus'
    },
    {
      id: 3,
      source: require('@/assets/images/rvce-building.jpg'),
      title: 'RVCE Building'
    },
  ];

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Image Slider */}
          <View style={styles.sliderContainer}>
            <Carousel
              loop
              width={width}
              height={width * 0.5}
              autoPlay={true}
              data={images}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setActiveSlide(index)}
              autoPlayInterval={3000}
              pagingEnabled={true}
              renderItem={({ item }) => (
                <View style={styles.slideItem}>
                  <Image
                    source={item.source}
                    style={styles.slideImage}
                    resizeMode="cover"
                  />
                  <View style={styles.slideTitleContainer}>
                    <Text style={styles.slideTitle}>{item.title}</Text>
                  </View>
                </View>
              )}
            />
            {renderPagination()}
          </View>

          {/* First Row - Quick Check-In and Cab Entry */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('QuickCheckIn')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="flash" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Quick Check-In</Text>
                <Text style={styles.cardDescription}>Fast track visitor entry</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('CabEntry')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="car-outline" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Cab Entry</Text>
                <Text style={styles.cardDescription}>Register campus cabs</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Second Row - Approval Status and Today's Visitors */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('ApprovalStatus')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="time-outline" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Approval Status</Text>
                <Text style={styles.cardDescription}>View pending requests</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: Colors.PRIMARY }]}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('TodaysVisitors')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="people-outline" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Today's Visitors</Text>
                <Text style={styles.cardDescription}>View active visitors</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Third Row - Gallery and Register */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('Document')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="images-outline" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Document</Text>
                <Text style={styles.cardDescription}>See All Documents</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]}
              onPress={() => navigation.navigate('VisitorEntry')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="person-add-outline" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Register</Text>
                <Text style={styles.cardDescription}>New visitor entry</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sliderContainer: {
    height: Dimensions.get('window').width * 0.5,
    marginVertical: 20,
    position: 'relative',
  },
  slideItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  slideTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative', // For badge positioning
  },
  cardHalf: {
    width: '48%', // Slightly less than 50% to account for spacing
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#D10000',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
