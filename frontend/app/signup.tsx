// import { useState } from 'react';
// import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const statusOptions = ['Student', 'Chancerkarte', 'Asylum', 'Worker', 'Other'];

// export default function SignupScreen() {
//   const router = useRouter();
//   const replace = (path: string) => router.replace({ pathname: path } as any);

//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [error, setError] = useState('');

//   const handleSignup = async () => {
//     setError('');
//     if (!fullName.trim() || !email.trim() || !password.trim()) {
//       setError('All fields are required.');
//       return;
//     }
//     if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email.trim())) {
//       setError('Please use a valid email.');
//       return;
//     }
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters.');
//       return;
//     }

//     const usersRaw = await AsyncStorage?.getItem('trackwise_users');
//     const users = usersRaw ? JSON.parse(usersRaw) : [];
//     const exists = users.some((u: any) => u.email === email.trim().toLowerCase());
//     if (exists) {
//       setError('Email already in use. Please log in.');
//       return;
//     }

//     const newUser = {
//       fullName: fullName.trim(),
//       email: email.trim().toLowerCase(),
//       password,
//       status,
//       createdAt: Date.now(),
//     };

//     await AsyncStorage?.setItem('trackwise_users', JSON.stringify([...users, newUser]));
//     Alert.alert('Success', 'Account created. You can now sign in.', [{ text: 'Go to Login', onPress: () => replace('/login') }]);
//   };

//   return (
//     <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <View style={styles.card}>
//         <Text style={styles.title}>Create TrackWise account</Text>
//         <Text style={styles.subtitle}>Start tracking documents and working hours in one place.</Text>

//         <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
//         <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
//         <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

//         <View style={styles.badges}>
//           {statusOptions.map((opt) => (
//             <TouchableOpacity key={opt} style={[styles.badge, status === opt && styles.badgeActive]} onPress={() => setStatus(opt)}>
//               <Text style={[styles.badgeText, status === opt && styles.badgeTextActive]}>{opt}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {error ? <Text style={styles.error}>{error}</Text> : null}

//         <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
//           <Text style={styles.primaryText}>Sign Up</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => replace('/login')}>
//           <Text style={styles.linkText}>Already have an account?</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: { flex: 1, backgroundColor: '#fff8f0', justifyContent: 'center', padding: 16 },
//   card: { backgroundColor: '#ffffff', borderRadius: 22, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 7, boxShadow: '0px 8px 16px rgba(0,0,0,0.09)' },
//   title: { fontSize: 26, fontWeight: '800', color: '#1a3d72' },
//   subtitle: { marginTop: 6, marginBottom: 18, color: '#607296' },
//   input: { height: 50, borderColor: '#eaf0fb', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, marginTop: 10, backgroundColor: '#fcfdff' },
//   badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
//   badge: { borderRadius: 12, borderWidth: 1, borderColor: '#c2c9d6', paddingVertical: 8, paddingHorizontal: 10, margin: 4 },
//   badgeActive: { borderColor: '#2277ff', backgroundColor: '#e6f0ff' },
//   badgeText: { color: '#5a6480', fontSize: 14 },
//   badgeTextActive: { color: '#194dbe', fontWeight: '700' },
//   primaryButton: { backgroundColor: '#2d79ff', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
//   primaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
//   linkText: { color: '#2d79ff', marginTop: 12, textAlign: 'center', fontWeight: '700' },
//   error: { marginTop: 10, color: '#e03b45', textAlign: 'center' },
// });




import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, StyleSheet,
  Text, TextInput, TouchableOpacity, View, ActivityIndicator
} from 'react-native';

export default function SignupScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email.trim().toLowerCase(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Signup failed. Try again.');
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
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.title}>TrackWise</Text>

        {step === 'form' ? (
          <>
            <Text style={styles.subtitle}>Create your account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryText}>Sign Up</Text>
              }
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.smallText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Check your email for a verification code</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerify} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryText}>Verify Email</Text>
              }
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f2f7ff', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  title: { fontSize: 28, fontWeight: '800', color: '#0f3f7d' },
  subtitle: { marginTop: 6, color: '#4e618f', marginBottom: 20 },
  input: { height: 48, borderColor: '#e3e9f1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, marginTop: 10, backgroundColor: '#fafbff' },
  primaryButton: { backgroundColor: '#2e6bff', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  linkText: { color: '#2e6bff', marginTop: 12, fontWeight: '700' },
  row: { flexDirection: 'row', marginTop: 16, justifyContent: 'center', gap: 8 },
  smallText: { color: '#6f7c99', marginTop: 12 },
  error: { marginTop: 10, color: '#d02828', textAlign: 'center' },
});