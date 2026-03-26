import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const navigate = (path: string) => router.replace({ pathname: path } as any);
  const push = (path: string) => router.push({ pathname: path } as any);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    const usersRaw = await AsyncStorage?.getItem('trackwise_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const user = users.find((u: any) => u.email === email.trim().toLowerCase());
    if (!user) {
      setError('User not found. Please sign up first.');
      return;
    }
    if (user.password !== password) {
      setError('Invalid password.');
      return;
    }

    await AsyncStorage?.setItem('trackwise_session', JSON.stringify(user));
    Alert.alert('Success', `Welcome back, ${user.fullName}!`, [
      { text: 'Continue', onPress: () => navigate('/(tabs)') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>TrackWise Login</Text>
        <Text style={styles.subtitle}>Fast, safe sign-in for your document/timesheet tracking.</Text>

        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => push('/forgot-password')}>
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.smallText}>No account yet?</Text>
          <TouchableOpacity onPress={() => push('/signup')}>
            <Text style={styles.linkText}>Create one</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Demo login: test@example.com / Test@123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f2f7ff', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, boxShadow: '0px 8px 20px rgba(0,0,0,0.1)' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f3f7d' },
  subtitle: { marginTop: 6, color: '#4e618f', marginBottom: 18 },
  input: { height: 48, borderColor: '#e3e9f1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, marginTop: 10, backgroundColor: '#fafbff' },
  primaryButton: { backgroundColor: '#2e6bff', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  linkText: { color: '#2e6bff', marginTop: 12, fontWeight: '700' },
  row: { flexDirection: 'row', marginTop: 16, justifyContent: 'center', gap: 8 },
  smallText: { color: '#6f7c99' },
  hint: { marginTop: 12, color: '#8f9cb2', fontSize: 12, textAlign: 'center' },
  error: { marginTop: 10, color: '#d02828', textAlign: 'center' },
});