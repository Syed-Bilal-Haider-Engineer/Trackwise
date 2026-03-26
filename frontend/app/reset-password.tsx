import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const replace = (path: string) => router.replace({ pathname: path } as any);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const sendReset = () => {
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email.trim())) {
      setError('Please enter a valid email');
      return;
    }
    Alert.alert('Reset link sent', `A reset link has been sent to ${email.trim()}.`, [{ text: 'OK', onPress: () => replace('/login') }]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password Request</Text>
        <Text style={styles.subtitle}>Just enter your email to get a reset link.</Text>

        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={sendReset}>
          <Text style={styles.primaryText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => replace('/login')}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f4ff', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#4b1f7a', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8, boxShadow: '0px 6px 14px rgba(79, 50, 199, 0.12)' },
  title: { fontSize: 26, fontWeight: '800', color: '#5b21b6' },
  subtitle: { marginTop: 6, marginBottom: 14, color: '#6d28d9' },
  input: { height: 52, borderWidth: 1, borderColor: '#ddd6fe', borderRadius: 12, paddingHorizontal: 14, marginTop: 10, backgroundColor: '#f8f2ff' },
  error: { marginTop: 10, color: '#b91c1c', textAlign: 'center' },
  primaryButton: { backgroundColor: '#7c3aed', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  primaryText: { color: '#fff', fontWeight: '700' },
  linkButton: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#7c3aed', fontWeight: '700' },
});