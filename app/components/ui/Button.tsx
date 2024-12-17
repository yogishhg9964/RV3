import { TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Text } from './Text';

interface ButtonProps {
  onPress: () => void;
  children: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ onPress, children, style, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 