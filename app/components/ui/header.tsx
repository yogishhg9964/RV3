import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBackButton = true, onBack }: HeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
}); 