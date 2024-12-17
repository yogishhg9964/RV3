import { useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    primary: '#007AFF',
    secondary: '#5856D6',
  },
  dark: {
    text: '#fff',
    background: '#000',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
  },
}; 