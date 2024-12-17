import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  hint: string;
}

export function InputHint({ hint }: Props) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="info-outline" size={14} color="#666" />
      <Text style={styles.text}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 8,
  },
  text: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 