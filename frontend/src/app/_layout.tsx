import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { AppProviders } from './_providers/AppProviders';
import { useAuth } from '@/shared/lib/auth';
// import { Colors } from '@/shared/theme/colors';
import { useTheme } from '@/shared/theme/ThemeContext';


function SplashView() {
  const { colors: Colors } = useTheme();
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.splash}
    >
      <View style={styles.splashContent}>
        <View style={styles.logoContainer}>
          <Ionicons name="briefcase" size={48} color="white" />
        </View>
        <Text style={styles.appName}>TrackWise</Text>
        <Text style={styles.tagline}>Track your work, stay compliant</Text>
      </View>
      <ActivityIndicator color="rgba(255,255,255,0.7)" size="large" style={styles.loader} />
    </LinearGradient>
  );
}

function AuthGate() {
  const { colors: Colors } = useTheme();
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)/');
    }
  }, [user, isLoading, segments]);

  if (isLoading) return <SplashView />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AppProviders>
      <AuthGate />
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 160,
    paddingBottom: 80,
  },
  splashContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
  },
  loader: {
    marginBottom: 20,
  },
});
