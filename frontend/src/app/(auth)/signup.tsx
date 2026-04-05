import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// import { useAuth } from '@/shared/lib/auth';
import { useSignUp } from '@clerk/clerk-expo';
// import { Colors } from '@/shared/theme/colors';
import { useTheme } from '@/shared/theme/ThemeContext';

export default function SignupScreen() {
  const router = useRouter();
  const { colors: Colors } = useTheme();
  // const { signup } = useAuth();
  const { signUp, setActive, isLoaded } = useSignUp();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSignup = async () => {
  //   setError('');
  //   if (!name.trim() || !email.trim() || !password.trim() || !confirmPass.trim()) {
  //     setError('Please fill in all fields');
  //     return;
  //   }
  //   if (password !== confirmPass) {
  //     setError('Passwords do not match');
  //     return;
  //   }
  //   if (password.length < 6) {
  //     setError('Password must be at least 6 characters');
  //     return;
  //   }
  //   setLoading(true);
  //   const result = await signup(name, email, password);
  //   setLoading(false);
  //   if (!result.success) setError(result.error ?? 'Sign up failed');
  // };

const handleSignup = async () => {
  if (!isLoaded) return;
  setError('');
  if (!name.trim() || !email.trim() || !password.trim() || !confirmPass.trim()) {
    setError('Please fill in all fields');
    return;
  }
  if (password !== confirmPass) {
    setError('Passwords do not match');
    return;
  }
  setLoading(true);
  try {
    // await signUp.create({ emailAddress: email.trim().toLowerCase(), password });
    await signUp.create({
  emailAddress: email.trim().toLowerCase(),
  password,
  firstName: name.trim().split(' ')[0],
  lastName: name.trim().split(' ').slice(1).join(' ') || undefined,
});
    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    setStep('verify');
  } catch (err: any) {
    setError(err.errors?.[0]?.message || 'Sign up failed');
  } finally {
    setLoading(false);
  }
};

const handleVerify = async () => {
  if (!isLoaded) return;
  setError('');
  setLoading(true);
  try {
    const result = await signUp.attemptEmailAddressVerification({ code });
    await setActive({ session: result.createdSessionId });
  } catch (err: any) {
    setError(err.errors?.[0]?.message || 'Invalid code');
  } finally {
    setLoading(false);
  }
};

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1, backgroundColor: Colors.background }}
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // >
    //   <ScrollView
    //     contentContainerStyle={styles.container}
    //     keyboardShouldPersistTaps="handled"
    //     showsVerticalScrollIndicator={false}
    //   >
    //     <LinearGradient
    //       colors={[Colors.gradientStart, Colors.gradientEnd]}
    //       style={styles.header}
    //     >
    //       <TouchableOpacity style={styles.back} onPress={() => router.back()}>
    //         <Ionicons name="arrow-back" size={22} color="white" />
    //       </TouchableOpacity>
    //       <View style={styles.logoWrap}>
    //         <Ionicons name="briefcase" size={36} color="white" />
    //       </View>
    //       <Text style={styles.appName}>TrackWise</Text>
    //       <Text style={styles.tagline}>Create your account</Text>
    //     </LinearGradient>

    //     <View style={styles.card}>
    //       <Text style={styles.title}>Join TrackWise 🚀</Text>
    //       <Text style={styles.subtitle}>Start tracking your work hours today</Text>

    //       {error ? (
    //         <View style={styles.errorBox}>
    //           <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
    //           <Text style={styles.errorText}>{error}</Text>
    //         </View>
    //       ) : null}

    //       <View style={styles.field}>
    //         <Text style={styles.label}>Full Name</Text>
    //         <View style={styles.inputRow}>
    //           <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
    //           <TextInput
    //             style={styles.input}
    //             value={name}
    //             onChangeText={setName}
    //             placeholder="Ahmed Müller"
    //             placeholderTextColor={Colors.textMuted}
    //             autoCapitalize="words"
    //           />
    //         </View>
    //       </View>

    //       <View style={styles.field}>
    //         <Text style={styles.label}>Email</Text>
    //         <View style={styles.inputRow}>
    //           <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
    //           <TextInput
    //             style={styles.input}
    //             value={email}
    //             onChangeText={setEmail}
    //             placeholder="your@email.com"
    //             placeholderTextColor={Colors.textMuted}
    //             keyboardType="email-address"
    //             autoCapitalize="none"
    //             autoCorrect={false}
    //           />
    //         </View>
    //       </View>

    //       <View style={styles.field}>
    //         <Text style={styles.label}>Password</Text>
    //         <View style={styles.inputRow}>
    //           <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
    //           <TextInput
    //             style={[styles.input, { flex: 1 }]}
    //             value={password}
    //             onChangeText={setPassword}
    //             placeholder="Min. 6 characters"
    //             placeholderTextColor={Colors.textMuted}
    //             secureTextEntry={!showPass}
    //           />
    //           <TouchableOpacity onPress={() => setShowPass(v => !v)}>
    //             <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
    //           </TouchableOpacity>
    //         </View>
    //       </View>

    //       <View style={styles.field}>
    //         <Text style={styles.label}>Confirm Password</Text>
    //         <View style={styles.inputRow}>
    //           <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} />
    //           <TextInput
    //             style={styles.input}
    //             value={confirmPass}
    //             onChangeText={setConfirmPass}
    //             placeholder="Repeat password"
    //             placeholderTextColor={Colors.textMuted}
    //             secureTextEntry={!showPass}
    //           />
    //         </View>
    //       </View>

    //       <TouchableOpacity
    //         style={styles.btnWrap}
    //         onPress={handleSignup}
    //         disabled={loading}
    //         activeOpacity={0.85}
    //       >
    //         <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
    //           {loading
    //             ? <ActivityIndicator color="white" />
    //             : <Text style={styles.btnText}>Create Account</Text>
    //           }
    //         </LinearGradient>
    //       </TouchableOpacity>

    //       <View style={styles.footerRow}>
    //         <Text style={styles.footerLabel}>Already have an account? </Text>
    //         <TouchableOpacity onPress={() => router.back()}>
    //           <Text style={styles.footerLink}>Sign In</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </ScrollView>
    // </KeyboardAvoidingView>

    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
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
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <Ionicons name="briefcase" size={36} color="white" />
          </View>
          <Text style={styles.appName}>TrackWise</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: Colors.card }] }>
          {step === 'verify' ? (
            <>
              <Text style={[styles.title, { color: Colors.text }]}>Verify Email ✉️</Text>
              <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>Check your email for a 6-digit code</Text>

              {error ? (
                <View style={[styles.errorBox, { backgroundColor: Colors.dangerLight }] }>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
                  <Text style={[styles.errorText, { color: Colors.dangerDark }]}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.label}>Verification Code</Text>
                <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }] }>
                  <Ionicons name="key-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: Colors.text }]}
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.btnWrap} onPress={handleVerify} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Verify & Continue</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: Colors.text }]}>Join TrackWise 🚀</Text>
              <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>Start tracking your work hours today</Text>

              {error ? (
                <View style={[styles.errorBox, { backgroundColor: Colors.dangerLight }] }>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
                  <Text style={[styles.errorText, { color: Colors.dangerDark }]}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={[styles.label, { color: Colors.text }]}>Full Name</Text>
                <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }] }>
                  <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: Colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ahmed Müller"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: Colors.text }]}>Email</Text>
                <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }] }>
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
                <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }] }>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPass}
                  />
                  <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                    <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={[styles.label, { color: Colors.text }]}>Confirm Password</Text>
                <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }] }>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={[styles.input, { color: Colors.text }]}
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                    placeholder="Repeat password"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPass}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.btnWrap} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Create Account</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={[styles.footerLabel, { color: Colors.textSecondary }]}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={[styles.footerLink, { color: Colors.primary }]}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  header: {
    paddingTop: Platform.OS === 'web' ? 60 : 56,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  back: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 60 : 56,
    left: 20,
    padding: 4,
  },
  logoWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  appName: { fontSize: 26, fontWeight: '800', color: 'white' },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  card: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 28,
    paddingBottom: 50,
    flex: 1,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
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
  field: { marginBottom: 14 },
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
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 20 },
  btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerLabel: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});
