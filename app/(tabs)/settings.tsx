import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=user_main' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alex Morgan</Text>
              <Text style={styles.profileEmail}>alex.morgan@example.com</Text>
            </View>
            <Pressable style={styles.editProfileButton}>
              <IconSymbol name="pencil" size={20} color="#2B4BFF" />
            </Pressable>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <IconSymbol name="moon.fill" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#3e3e3e', true: '#2B4BFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <IconSymbol name="bell.fill" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#2B4BFF' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.section}>
          <Pressable style={styles.row}>
            <View style={styles.rowIcon}>
              <IconSymbol name="questionmark.circle.fill" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={20} color="rgba(255, 255, 255, 0.4)" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row}>
            <View style={styles.rowIcon}>
              <IconSymbol name="lock.shield.fill" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <IconSymbol name="chevron.right" size={20} color="rgba(255, 255, 255, 0.4)" />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06081A',
  },
  header: {
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
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1D33',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editProfileButton: {
    padding: 8,
    backgroundColor: 'rgba(43, 75, 255, 0.1)',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 12,
    marginBottom: -12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 12,
    marginLeft: 44,
  },
  logoutButton: {
    marginTop: 12,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '700',
  },
});
