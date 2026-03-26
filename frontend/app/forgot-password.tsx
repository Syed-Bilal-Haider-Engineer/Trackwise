import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const replace = (path: string) => router.replace({ pathname: path } as any);

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const updatePassword = async () => {
    setError('');
    if (!email.trim() || !oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password must match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    const usersRaw = await AsyncStorage?.getItem('trackwise_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const userIndex = users.findIndex((u: any) => u.email === email.trim().toLowerCase());
    if (userIndex === -1) {
      setError('User not found.');
      return;
    }
    if (users[userIndex].password !== oldPassword) {
      setError('Old password does not match.');
      return;
    }

    users[userIndex].password = newPassword;
    await AsyncStorage?.setItem('trackwise_users', JSON.stringify(users));

    Alert.alert('Success', 'Password updated. Please log in with your new password.', [{ text: 'OK', onPress: () => replace('/login') }]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Send request and change with your old password.</Text>

        <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Old Password" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
        <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={updatePassword}>
          <Text style={styles.primaryButtonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => replace('/reset-password')}>
          <Text style={styles.linkText}>Need to request reset link?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#effdf8', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6, boxShadow: '0px 6px 14px rgba(0,0,0,0.1)' },
  title: { fontSize: 26, fontWeight: '800', color: '#065f46' },
  subtitle: { fontSize: 14, color: '#0f766e', marginTop: 6, marginBottom: 14 },
  input: { height: 50, borderColor: '#d2f4e8', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, marginTop: 10, backgroundColor: '#f3fdf9' },
  error: { color: '#de2a38', textAlign: 'center', marginTop: 10 },
  primaryButton: { height: 52, borderRadius: 12, backgroundColor: '#047857', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#047857', fontSize: 14, fontWeight: '700' },
});