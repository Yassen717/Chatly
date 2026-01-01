import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#4facfe',
        tabBarInactiveTintColor: '#8a8a9f',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={StyleSheet.absoluteFill} />
          )
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.iconContainerFocused
            ]}>
              <IconSymbol
                size={focused ? 24 : 22}
                name="message.fill"
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && styles.iconContainerFocused
            ]}>
              <IconSymbol
                size={focused ? 24 : 22}
                name="gearshape.fill"
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(16, 16, 34, 0.7)'  // More transparent for blur on iOS
      : 'rgba(16, 16, 34, 0.98)', // More opaque for Android
    borderTopWidth: 0,
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 28 : 20,
    height: 74,
    paddingBottom: 10,
    paddingTop: 8,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(79, 172, 254, 0.2)',
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabBarItem: {
    paddingTop: 6,
    gap: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
  },
});

