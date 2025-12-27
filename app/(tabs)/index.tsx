import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data for conversation history
const HISTORY_DATA = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: 'React Native Optimization',
        preview: 'How can I improve the performance of my list...',
        time: '10:30 AM',
        avatar: 'https://i.pravatar.cc/150?u=1',
      },
      {
        id: '2',
        title: 'Design System Ideas',
        preview: 'I need some inspiration for a dark mode...',
        time: '9:15 AM',
        avatar: 'https://i.pravatar.cc/150?u=2',
      },
    ],
  },
  {
    title: 'Previous 7 Days',
    data: [
      {
        id: '3',
        title: 'Debugging API Errors',
        preview: 'The server is returning 500 when I try to...',
        time: 'Yesterday',
        avatar: 'https://i.pravatar.cc/150?u=3',
      },
      {
        id: '4',
        title: 'Marketing Copy',
        preview: 'Write a catchy tagline for a coffee shop...',
        time: 'Mon',
        avatar: 'https://i.pravatar.cc/150?u=4',
      },
      {
        id: '5',
        title: 'Travel Itinerary',
        preview: 'Plan a 3-day trip to Tokyo with a focus on...',
        time: 'Sun',
        avatar: 'https://i.pravatar.cc/150?u=5',
      },
    ],
  },
];

export default function ConversationHistoryScreen() {
  const router = useRouter();

  const handleChatPress = (id: string) => {
    router.push('/chat');
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [styles.chatItem, pressed && styles.chatItemPressed]}
      onPress={() => handleChatPress(item.id)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.chatPreview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Pressable style={styles.newChatButton} onPress={() => router.push('/chat')}>
           <IconSymbol name="square.and.pencil" size={24} color="#2B4BFF" />
        </Pressable>
      </View>

      <FlatList
        data={HISTORY_DATA}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionHeader}>{item.title}</Text>
            {item.data.map((chat) => (
              <View key={chat.id}>{renderItem({ item: chat })}</View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06081A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  newChatButton: {
    padding: 8,
    backgroundColor: 'rgba(43, 75, 255, 0.1)',
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  chatItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1D33',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  chatPreview: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
});
