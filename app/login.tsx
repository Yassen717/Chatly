import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Log in</ThemedText>
      <ThemedText style={styles.hint}>This is a placeholder screen for your auth flow.</ThemedText>

      <Link href="/" style={styles.link}>
        <ThemedText type="link">Back to Welcome</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  hint: {
    opacity: 0.7,
  },
  link: {
    marginTop: 8,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
});
