// import { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// import { useAuth } from '@/shared/lib/auth';
// import { Colors } from '@/shared/theme/colors';

// export default function ResetPasswordScreen() {
//   const router = useRouter();
//   const { resetPassword } = useAuth();

//   const [email, setEmail] = useState('');
//   const [code, setCode] = useState('');
//   const [newPass, setNewPass] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [done, setDone] = useState(false);

//   const handleReset = async () => {
//     setError('');
//     if (!email.trim() || !code.trim() || !newPass.trim() || !confirmPass.trim()) {
//       setError('Please fill in all fields');
//       return;
//     }
//     if (newPass !== confirmPass) {
//       setError('Passwords do not match');
//       return;
//     }
//     if (newPass.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }
//     setLoading(true);
//     const result = await resetPassword(email, code, newPass);
//     setLoading(false);
//     if (!result.success) {
//       setError(result.error ?? 'Failed to reset password');
//     } else {
//       setDone(true);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: Colors.background }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//       >
//         <LinearGradient
//           colors={[Colors.gradientStart, Colors.gradientEnd]}
//           style={styles.header}
//         >
//           <TouchableOpacity style={styles.back} onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={22} color="white" />
//           </TouchableOpacity>
//           <View style={styles.iconWrap}>
//             <Ionicons name="key-outline" size={38} color="white" />
//           </View>
//           <Text style={styles.heading}>Reset Password</Text>
//           <Text style={styles.subheading}>Enter code and your new password</Text>
//         </LinearGradient>

//         <View style={styles.card}>
//           {done ? (
//             <View style={styles.successBox}>
//               <Ionicons name="checkmark-circle" size={64} color={Colors.safe} />
//               <Text style={styles.successTitle}>Password Reset!</Text>
//               <Text style={styles.successText}>Your password has been updated successfully.</Text>
//               <TouchableOpacity
//                 style={styles.btnWrap}
//                 onPress={() => router.replace('/(auth)/login')}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
//                   <Text style={styles.btnText}>Sign In Now</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <Text style={styles.title}>Set new password</Text>
//               <Text style={styles.subtitle}>Use code 1234 from the previous step.</Text>

//               {error ? (
//                 <View style={styles.errorBox}>
//                   <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
//                   <Text style={styles.errorText}>{error}</Text>
//                 </View>
//               ) : null}

//               {[
//                 { label: 'Email', value: email, set: setEmail, placeholder: 'your@email.com', icon: 'mail-outline', type: 'email-address' as const },
//                 { label: 'Reset Code', value: code, set: setCode, placeholder: 'e.g. 1234', icon: 'keypad-outline', type: 'number-pad' as const },
//               ].map(f => (
//                 <View key={f.label} style={styles.field}>
//                   <Text style={styles.label}>{f.label}</Text>
//                   <View style={styles.inputRow}>
//                     <Ionicons name={f.icon as any} size={18} color={Colors.textMuted} />
//                     <TextInput
//                       style={styles.input}
//                       value={f.value}
//                       onChangeText={f.set}
//                       placeholder={f.placeholder}
//                       placeholderTextColor={Colors.textMuted}
//                       keyboardType={f.type}
//                       autoCapitalize="none"
//                     />
//                   </View>
//                 </View>
//               ))}

//               <View style={styles.field}>
//                 <Text style={styles.label}>New Password</Text>
//                 <View style={styles.inputRow}>
//                   <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
//                   <TextInput
//                     style={styles.input}
//                     value={newPass}
//                     onChangeText={setNewPass}
//                     placeholder="Min. 6 characters"
//                     placeholderTextColor={Colors.textMuted}
//                     secureTextEntry
//                   />
//                 </View>
//               </View>

//               <View style={styles.field}>
//                 <Text style={styles.label}>Confirm New Password</Text>
//                 <View style={styles.inputRow}>
//                   <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} />
//                   <TextInput
//                     style={styles.input}
//                     value={confirmPass}
//                     onChangeText={setConfirmPass}
//                     placeholder="Repeat new password"
//                     placeholderTextColor={Colors.textMuted}
//                     secureTextEntry
//                   />
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={styles.btnWrap}
//                 onPress={handleReset}
//                 disabled={loading}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
//                   {loading
//                     ? <ActivityIndicator color="white" />
//                     : <Text style={styles.btnText}>Reset Password</Text>
//                   }
//                 </LinearGradient>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, backgroundColor: Colors.background },
//   header: {
//     paddingTop: Platform.OS === 'web' ? 70 : 62,
//     paddingBottom: 44,
//     alignItems: 'center',
//     gap: 8,
//     position: 'relative',
//   },
//   back: { position: 'absolute', top: Platform.OS === 'web' ? 70 : 62, left: 20, padding: 4 },
//   iconWrap: {
//     width: 76,
//     height: 76,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   heading: { fontSize: 24, fontWeight: '800', color: 'white' },
//   subheading: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
//   card: {
//     backgroundColor: Colors.card,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     marginTop: -20,
//     padding: 28,
//     paddingBottom: 50,
//     flex: 1,
//   },
//   title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 6 },
//   subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
//   errorBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.dangerLight,
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     gap: 8,
//   },
//   errorText: { flex: 1, color: Colors.dangerDark, fontSize: 13 },
//   field: { marginBottom: 14 },
//   label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.inputBg,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     paddingHorizontal: 14,
//     height: 52,
//     gap: 10,
//   },
//   input: { flex: 1, fontSize: 15, color: Colors.text },
//   btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
//   btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
//   btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
//   successBox: { alignItems: 'center', paddingTop: 40, gap: 12 },
//   successTitle: { fontSize: 24, fontWeight: '700', color: Colors.text },
//   successText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
// });





import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    setError('');
    if (!code.trim() || !newPass.trim() || !confirmPass.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    if (newPass.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const result = await resetPassword(code, newPass);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Failed to reset password');
    } else {
      setDone(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.iconWrap}>
            <Ionicons name="key-outline" size={38} color="white" />
          </View>
          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.subheading}>Enter the code from your email</Text>
        </LinearGradient>

        <View style={styles.card}>
          {done ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={72} color='#22c55e' />
              <Text style={styles.successTitle}>Password Reset!</Text>
              <Text style={styles.successText}>Your password has been updated successfully.</Text>
              <TouchableOpacity
                style={styles.btnWrap}
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  <Text style={styles.btnText}>Sign In Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Set new password</Text>
              <Text style={styles.subtitle}>Enter the 6-digit code from your email and choose a new password.</Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.label}>Reset Code</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="keypad-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    placeholder="6-digit code"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    value={newPass}
                    onChangeText={setNewPass}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showNew}
                  />
                  <TouchableOpacity onPress={() => setShowNew(v => !v)}>
                    <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.input}
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                    placeholder="Repeat new password"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showConfirm}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(v => !v)}>
                    <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.btnWrap}
                onPress={handleReset}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.btnText}>Reset Password</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: Platform.OS === 'web' ? 70 : 62,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  back: { position: 'absolute', top: Platform.OS === 'web' ? 70 : 62, left: 20, padding: 4 },
  iconWrap: {
    width: 76, height: 76, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heading: { fontSize: 24, fontWeight: '800', color: 'white' },
  subheading: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  card: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -20, padding: 28, paddingBottom: 50, flex: 1,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 20 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dangerLight, borderRadius: 10,
    padding: 12, marginBottom: 16, gap: 8,
  },
  errorText: { flex: 1, color: Colors.dangerDark, fontSize: 13 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
  btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  successBox: { alignItems: 'center', paddingTop: 40, gap: 16 },
  successTitle: { fontSize: 24, fontWeight: '700', color: Colors.text },
  successText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
});