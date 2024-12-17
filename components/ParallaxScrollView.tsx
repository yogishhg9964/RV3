import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { SpringScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = {
    transform: [
      {
        translateY: -HEADER_HEIGHT / 2,
      },
      {
        scale: 1,
      },
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <SpringScrollView>
        <ThemedView style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
          {headerImage}
        </ThemedView>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </SpringScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
