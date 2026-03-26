import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  // already prevented or not needed
});

export default function AppSplashScreen() {
  const router = useRouter();
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(offset, { toValue: -10, duration: 800, useNativeDriver: true }),
        Animated.timing(offset, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ).start();

    const checkAuth = async () => {
      const session = await AsyncStorage?.getItem('trackwise_session');
      const destination = session ? '/(tabs)' : '/login';
      setTimeout(async () => {
        await SplashScreen.hideAsync().catch(() => {});
        router.replace({ pathname: destination } as any);
      }, 1400);
    };

    checkAuth();
  }, [offset, router]);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/splash-icon.png')} style={styles.image} />
      <Animated.Text style={[styles.subText, { transform: [{ translateY: offset }] }]}>TrackWise</Animated.Text>
      <Animated.Text style={styles.subText}>Document + Time Tracker</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  subText: {
    marginTop: 14,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
  },
});
