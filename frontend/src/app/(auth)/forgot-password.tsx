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

// export default function ForgotPasswordScreen() {
//   const router = useRouter();
//   const { forgotPassword } = useAuth();

//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);

//   const handleSend = async () => {
//     setError('');
//     if (!email.trim()) {
//       setError('Please enter your email address');
//       return;
//     }
//     setLoading(true);
//     const result = await forgotPassword(email);
//     setLoading(false);
//     if (!result.success) {
//       setError(result.error ?? 'Failed to send reset code');
//     } else {
//       setSent(true);
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
//             <Ionicons name="lock-open-outline" size={38} color="white" />
//           </View>
//           <Text style={styles.heading}>Forgot Password</Text>
//           <Text style={styles.subheading}>We'll send you a reset code</Text>
//         </LinearGradient>

//         <View style={styles.card}>
//           {sent ? (
//             <View style={styles.successBox}>
//               <View style={styles.successIcon}>
//                 <Ionicons name="checkmark-circle" size={48} color={Colors.safe} />
//               </View>
//               <Text style={styles.successTitle}>Reset Code Sent!</Text>
//               <Text style={styles.successText}>
//                 Your reset code is{' '}
//                 <Text style={styles.code}>1234</Text>
//                 {'\n'}Use it on the reset password screen.
//               </Text>
//               <TouchableOpacity
//                 style={styles.btnWrap}
//                 onPress={() => router.push('/(auth)/reset-password')}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
//                   <Text style={styles.btnText}>Enter Reset Code</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               <Text style={styles.title}>Reset your password</Text>
//               <Text style={styles.subtitle}>
//                 Enter the email address associated with your account.
//               </Text>

//               {error ? (
//                 <View style={styles.errorBox}>
//                   <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
//                   <Text style={styles.errorText}>{error}</Text>
//                 </View>
//               ) : null}

//               <View style={styles.field}>
//                 <Text style={styles.label}>Email</Text>
//                 <View style={styles.inputRow}>
//                   <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
//                   <TextInput
//                     style={styles.input}
//                     value={email}
//                     onChangeText={setEmail}
//                     placeholder="your@email.com"
//                     placeholderTextColor={Colors.textMuted}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                   />
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={styles.btnWrap}
//                 onPress={handleSend}
//                 disabled={loading}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
//                   {loading
//                     ? <ActivityIndicator color="white" />
//                     : <Text style={styles.btnText}>Send Reset Code</Text>
//                   }
//                 </LinearGradient>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
//                 <Ionicons name="arrow-back-outline" size={16} color={Colors.primary} />
//                 <Text style={styles.backLinkText}>Back to Sign In</Text>
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
//   title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 8 },
//   subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 20 },
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
//   field: { marginBottom: 20 },
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
//   btnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
//   btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
//   btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
//   backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
//   backLinkText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
//   successBox: { alignItems: 'center', paddingTop: 20 },
//   successIcon: { marginBottom: 16 },
//   successTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 12 },
//   successText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
//   code: { fontWeight: '800', color: Colors.primary, fontSize: 18 },
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
import { useTheme } from '@/shared/theme/ThemeContext';

export default function ForgotPasswordScreen() {
  const { colors: Colors } = useTheme();
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Failed to send reset code');
    } else {
      setSent(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.background }}
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
            <Ionicons name="lock-open-outline" size={38} color="white" />
          </View>
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subheading}>We'll send a reset code to your email</Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: Colors.card }]}>
          {sent ? (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Ionicons name="mail" size={56} color={Colors.primary} />
              </View>
              <Text style={[styles.successTitle, { color: Colors.text }]}>Check your email!</Text>
              <Text style={[styles.successText, { color: Colors.textSecondary }]}>
                We sent a 6-digit reset code to{'\n'}
                <Text style={{ fontWeight: '700', color: Colors.primary }}>{email}</Text>
              </Text>
              <TouchableOpacity
                style={styles.btnWrap}
                onPress={() => router.push('/(auth)/reset-password')}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  <Text style={styles.btnText}>Enter Reset Code</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backLink} onPress={() => setSent(false)}>
                <Text style={[styles.backLinkText, { color: Colors.primary }]}>Didn't receive it? Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.title, { color: Colors.text }]}>Reset your password</Text>
              <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
                Enter the email address associated with your account and we'll send you a reset code.
              </Text>

              {error ? (
                <View style={[styles.errorBox, { backgroundColor: Colors.dangerLight }]}>
                  <Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} />
                  <Text style={[styles.errorText, { color: Colors.dangerDark }]}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={[styles.label, { color: Colors.text }]}>Email</Text>
                <View style={[styles.inputRow, {
                  backgroundColor: Colors.inputBg,
                  borderColor: Colors.border,
                }]}>
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

              <TouchableOpacity
                style={styles.btnWrap}
                onPress={handleSend}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.btn}>
                  {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.btnText}>Send Reset Code</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={16} color={Colors.primary} />
                <Text style={[styles.backLinkText, { color: Colors.primary }]}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'web' ? 70 : 62,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  back: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 70 : 62,
    left: 20,
    padding: 4,
  },
  iconWrap: {
    width: 76, height: 76, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heading: { fontSize: 24, fontWeight: '800', color: 'white' },
  subheading: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  card: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -20, padding: 28, paddingBottom: 50, flex: 1,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, padding: 12, marginBottom: 16, gap: 8,
  },
  errorText: { flex: 1, fontSize: 13 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1.5,
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  btnWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  btn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  backLinkText: { fontSize: 14, fontWeight: '600' },
  successBox: { alignItems: 'center', paddingTop: 20 },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  successText: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});