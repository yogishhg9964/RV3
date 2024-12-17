import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface TextProps extends RNTextProps {
  lightColor?: string;
  darkColor?: string;
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <RNText style={[{ color }, style]} {...otherProps} />;
} 