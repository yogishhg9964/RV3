import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

export function Checkbox({ value, onValueChange, label }: CheckboxProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <MaterialIcons name="check" size={16} color="#fff" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f4ff',
    borderRadius: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6B46C1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#6B46C1',
  },
  label: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
}); 