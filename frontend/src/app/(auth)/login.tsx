import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// import { useAuth } from '@/shared/lib/auth';
import { useSignIn } from '@clerk/clerk-expo';
import { useTheme } from '@/shared/theme/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { colors: Colors } = useTheme();
  // const { login } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim().toLowerCase(),
        password,
      });
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.logoWrap}>
            <Ionicons name="briefcase" size={38} color="white" />
          </View>
          <Text style={styles.appName}>TrackWise</Text>
          <Text style={styles.tagline}>Track your work, stay compliant</Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: Colors.card }]}> 
          <Text style={[styles.title, { color: Colors.text }]}>Welcome back 👋</Text>
          <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>Sign in to your account</Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: Colors.dangerLight }]}> 
              <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
              <Text style={[styles.errorText, { color: Colors.dangerDark }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors.text }]}>Email</Text>
            <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={[styles.input, { color: Colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: Colors.text }]}>Password</Text>
            <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={[styles.input, { flex: 1, color: Colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgot}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={[styles.forgotText, { color: Colors.primary }]}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnWrap}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.btnText}>Sign In</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={[styles.footerLabel, { color: Colors.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flexGrow: 1 },
  header: {
    paddingTop: Platform.OS === 'web' ? 80 : 70,
    paddingBottom: 50,
    alignItems: 'center',
    gap: 8,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  appName: { fontSize: 30, fontWeight: '800', color: 'white', letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 28,
    paddingBottom: 50,
    flex: 1,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 13 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  forgot: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 13, fontWeight: '600' },
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerLabel: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});
