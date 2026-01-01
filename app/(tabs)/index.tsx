import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const PINNED_CHATS = [
  {
    id: 'p1',
    title: 'Chatly Assist',
    subtitle: 'Always active',
    type: 'bot',
    icon: 'star.fill',
    gradient: ['#1313ec', '#4facfe'], // Simulated with solid for now
    color: '#1313ec',
  },
  {
    id: 'p2',
    title: 'Brainstorming',
    subtitle: 'Last used 2d ago',
    type: 'history',
    icon: 'lightbulb.fill',
    color: '#FFA500', // Orange
    bgColor: 'rgba(255, 165, 0, 0.15)',
  },
];

const HISTORY_SECTIONS = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: 'Trip planning for Japan',
        preview: 'Here is an itinerary for Tokyo featuring Shibuya...',
        time: '10:30 AM',
        icon: 'airplane',
        color: '#3b82f6', // blue-500
        bgColor: 'rgba(59, 130, 246, 0.15)',
      },
      {
        id: '2',
        title: 'Debug React Component',
        preview: 'Try using the useEffect hook with a dependency...',
        time: '9:00 AM',
        icon: 'chevron.left.forwardslash.chevron.right',
        color: '#a855f7', // purple-500
        bgColor: 'rgba(168, 85, 247, 0.15)',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        title: 'Email draft to boss',
        preview: 'Subject: Q3 Project Update. Hi Sarah, here are...',
        time: '4:15 PM',
        icon: 'envelope.fill',
        color: '#10b981', // emerald-500
        bgColor: 'rgba(16, 185, 129, 0.15)',
      },
      {
        id: '4',
        title: 'Gift ideas for Mom',
        preview: 'Based on her interest in gardening, how about...',
        time: '11:20 AM',
        icon: 'gift.fill',
        color: '#f43f5e', // rose-500
        bgColor: 'rgba(244, 63, 94, 0.15)',
      },
    ],
  },
  {
    title: 'Previous 7 Days',
    data: [
      {
        id: '5',
        title: 'Explain Quantum Physics',
        preview: 'Imagine a cat in a box...',
        time: 'Fri',
        icon: 'atom',
        color: '#06b6d4', // cyan-500
        bgColor: 'rgba(6, 182, 212, 0.15)',
      },
    ],
  },
];

export default function ConversationHistoryScreen() {
  const router = useRouter();

  const handleChatPress = (id: string) => {
    router.push('/chat');
  };

  const renderPinnedItem = (item: any) => (
    <Pressable
      key={item.id}
      style={[
        styles.pinnedCard,
        item.type === 'bot' ? { backgroundColor: item.color } : { backgroundColor: '#1e1e2d', borderWidth: 1, borderColor: '#2d2d40' },
      ]}
      onPress={() => handleChatPress(item.id)}>
      <View style={styles.pinnedHeader}>
        <View
          style={[
            styles.pinnedIconContainer,
            item.type === 'history' && { backgroundColor: item.bgColor },
            item.type === 'bot' && { backgroundColor: 'rgba(255,255,255,0.2)' }
          ]}>
          <IconSymbol
            name={item.icon}
            size={24}
            color={item.type === 'bot' ? '#FFFFFF' : item.color}
          />
        </View>
      </View>
      <View>
        <Text
          style={[
            styles.pinnedTitle,
            item.type === 'history' ? { color: '#FFFFFF' } : { color: '#FFFFFF' },
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.pinnedSubtitle,
            item.type === 'history' ? { color: '#94a3b8' } : { color: 'rgba(255,255,255,0.8)' },
          ]}>
          {item.subtitle}
        </Text>
      </View>
      {/* Decorative icon for bot card */}
      {item.type === 'bot' && (
        <View style={styles.pinnedDecorativeIcon}>
          <IconSymbol name="star.circle.fill" size={80} color="rgba(255,255,255,0.1)" />
        </View>
      )}
    </Pressable>
  );

  const renderHistoryItem = ({ item }: { item: any }) => (
    <Pressable
      style={({ pressed }) => [styles.historyItem, pressed && styles.historyItemPressed]}
      onPress={() => handleChatPress(item.id)}>
      <View style={[styles.historyIconContainer, { backgroundColor: item.bgColor }]}>
        <IconSymbol name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.historyTime}>{item.time}</Text>
        </View>
        <Text style={styles.historyPreview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>History</Text>
          <Pressable style={styles.headerButton}>
            <IconSymbol name="ellipsis.circle" size={26} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pinned Section */}
        <View style={styles.pinnedSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pinnedScroll}>
            {PINNED_CHATS.map(renderPinnedItem)}
          </ScrollView>
        </View>

        {/* History List */}
        {HISTORY_SECTIONS.map((section) => (
          <View key={section.title} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionList}>
              {section.data.map((item) => (
                <View key={item.id}>{renderHistoryItem({ item })}</View>
              ))}
            </View>
          </View>
        ))}
        {/* Spacer for bottom nav */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/chat')}>
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101022', // background-dark
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#101022',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2d', // surface-dark
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  pinnedSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  pinnedScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pinnedCard: {
    width: 150,
    height: 130,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  pinnedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pinnedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinnedTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  pinnedSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  pinnedDecorativeIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
    transform: [{ rotate: '12deg' }],
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8', // text-secondary-dark
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2d',
    padding: 12,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  historyItemPressed: {
    backgroundColor: '#2d2d40',
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  historyTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },
  historyPreview: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1313ec', // primary
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1313ec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
