import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface CounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
  minValue?: number;
  maxValue?: number;
}

export function Counter({
  count,
  onIncrement,
  onDecrement,
  label,
  minValue = 1,
  maxValue = 10,
}: CounterProps) {
  const handleDecrement = () => {
    if (count > minValue) {
      onDecrement();
    }
  };

  const handleIncrement = () => {
    if (count < maxValue) {
      onIncrement();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          onPress={handleDecrement}
          style={[styles.button, count <= minValue && styles.buttonDisabled]}
          disabled={count <= minValue}
        >
          <Ionicons name="remove" size={24} color={count <= minValue ? '#999' : Colors.PRIMARY} />
        </TouchableOpacity>
        
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <TouchableOpacity 
          onPress={handleIncrement}
          style={[styles.button, count >= maxValue && styles.buttonDisabled]}
          disabled={count >= maxValue}
        >
          <Ionicons name="add" size={24} color={count >= maxValue ? '#999' : Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  countContainer: {
    marginHorizontal: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
}); 