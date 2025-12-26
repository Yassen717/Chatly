import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Chatly</ThemedText>
        <ThemedText type="subtitle">Chats</ThemedText>
      </ThemedView>

      <ThemedView style={styles.body}>
        <ThemedText>No chats yet.</ThemedText>
        <ThemedText style={styles.hint}>This is the clean starting point for your chat UI.</ThemedText>

        <Link href="/modal" style={styles.link}>
          <ThemedText type="link">About Chatly</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 18,
  },
  header: {
    gap: 6,
  },
  body: {
    gap: 12,
  },
  hint: {
    opacity: 0.7,
  },
  link: {
    marginTop: 6,
    paddingVertical: 8,
  },
});
