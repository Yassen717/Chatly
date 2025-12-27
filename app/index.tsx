import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark} />
            <Text style={styles.brandPrefix}>RK</Text>
          </View>
          <Text style={styles.brandName}>Chatly</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroOuterRing} />
          <View style={styles.heroInner}>
            <View style={styles.heroGlow} />
          </View>

          <View style={[styles.pill, styles.pillFast]}>
            <Text style={styles.pillText}>Fast</Text>
          </View>
          <View style={[styles.pill, styles.pillCreative]}>
            <Text style={styles.pillText}>Creative</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.titleTop}>Your Personal</Text>
          <Text style={styles.titleBottom}>AI Companion</Text>

          <Text style={styles.subtitle}>
            Chatly understands you. Get instant answers, writing help, and creative ideas in seconds.
          </Text>

          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.primaryButtonPressed : null]}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <IconSymbol name="chevron.right" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="./login" suppressHighlighting>
              <Text style={styles.footerLink}>Log in</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06081A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: '#06081A',
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#2B4BFF',
  },
  brandPrefix: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2B4BFF',
    letterSpacing: 0.5,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  heroOuterRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(140, 160, 255, 0.18)',
  },
  heroInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(140, 160, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlow: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(0, 195, 255, 0.20)',
    borderWidth: 2,
    borderColor: 'rgba(0, 195, 255, 0.55)',
  },
  pill: {
    position: 'absolute',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillFast: {
    left: 10,
    top: '35%',
  },
  pillCreative: {
    right: 10,
    top: '55%',
  },
  pillText: {
    color: '#D7DCFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    gap: 10,
  },
  titleTop: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleBottom: {
    fontSize: 38,
    fontWeight: '800',
    color: '#2B4BFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop: -4,
  },
  subtitle: {
    maxWidth: 320,
    textAlign: 'center',
    color: 'rgba(210, 218, 255, 0.68)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(220, 230, 255, 0.18)',
  },
  dotActive: {
    width: 26,
    backgroundColor: '#2B4BFF',
  },
  primaryButton: {
    marginTop: 8,
    width: '100%',
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1F2DFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#1F2DFF',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  footerText: {
    color: 'rgba(210, 218, 255, 0.65)',
    fontSize: 14,
  },
  footerLink: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
