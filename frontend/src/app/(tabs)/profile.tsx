// import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '@/shared/lib/auth';
// import { Colors } from '@/shared/theme/colors';
// import { useState } from 'react';
// import { useUser } from '@clerk/clerk-expo';

// export default function ProfileScreen() {



//     const { user, logout, updateProfile } = useAuth();
// const [editing, setEditing] = useState(false);
// const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] ?? '');
// const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') ?? '');
// const [saving, setSaving] = useState(false);

// const handleLogout = () => {
//         Alert.alert(
//             'Logout',
//             'Are you sure you want to logout?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 { text: 'Logout', style: 'destructive', onPress: logout },
//             ]
//         );
//     };

// const handleSave = async () => {
//   setSaving(true);
//   await updateProfile(firstName, lastName);
//   setSaving(false);
//   setEditing(false);
// };

// const [changingPass, setChangingPass] = useState(false);
// const [currentPass, setCurrentPass] = useState('');
// const [newPass, setNewPass] = useState('');
// const [passSaving, setPassSaving] = useState(false);
// const [passError, setPassError] = useState('');

// const handlePasswordChange = async () => {
//   if (!currentPass.trim() || !newPass.trim()) {
//     setPassError('Please fill in all fields');
//     return;
//   }
//   if (newPass.length < 8) {
//     setPassError('Password must be at least 8 characters');
//     return;
//   }
//   setPassSaving(true);
//   setPassError('');
//   try {
//     await user?.updatePassword({ currentPassword: currentPass, newPassword: newPass });
//     setChangingPass(false);
//     setCurrentPass('');
//     setNewPass('');
//     Alert.alert('Success', 'Password updated successfully!');
//   } catch (err: any) {
//     setPassError(err.errors?.[0]?.message || 'Failed to update password');
//   } finally {
//     setPassSaving(false);
//   }
// };

//     return (
//   <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//     <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
//       <View style={styles.avatarWrap}>
//         <Text style={styles.avatarText}>
//           {user?.name?.charAt(0).toUpperCase() ?? '?'}
//         </Text>
//       </View>
//       <Text style={styles.name}>{user?.name ?? 'User'}</Text>
//       <Text style={styles.email}>{user?.email ?? ''}</Text>
//     </LinearGradient>

//     <View style={styles.card}>
//       <Text style={styles.sectionTitle}>Account</Text>

//       <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(v => !v)}>
//         <Ionicons name={editing ? 'close-outline' : 'pencil-outline'} size={18} color={Colors.primary} />
//         <Text style={styles.editText}>{editing ? 'Cancel' : 'Edit Profile'}</Text>
//       </TouchableOpacity>

//       {editing && (
//         <View style={{ marginBottom: 16 }}>
//           <Text style={styles.label}>First Name</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
//             <TextInput
//               style={styles.input}
//               value={firstName}
//               onChangeText={setFirstName}
//               placeholder="First Name"
//               placeholderTextColor={Colors.textMuted}
//             />
//           </View>
//           <Text style={[styles.label, { marginTop: 12 }]}>Last Name</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
//             <TextInput
//               style={styles.input}
//               value={lastName}
//               onChangeText={setLastName}
//               placeholder="Last Name"
//               placeholderTextColor={Colors.textMuted}
//             />
//           </View>
//           <TouchableOpacity
//             style={[styles.logoutBtn, { backgroundColor: Colors.primary, marginTop: 16 }]}
//             onPress={handleSave}
//             disabled={saving}
//           >
//             {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutText}>Save Changes</Text>}
//           </TouchableOpacity>
//         </View>
//       )}

//       <View style={styles.infoRow}>
//         <Ionicons name="person-outline" size={20} color={Colors.primary} />
//         <View style={styles.infoText}>
//           <Text style={styles.infoLabel}>Full Name</Text>
//           <Text style={styles.infoValue}>{user?.name ?? '-'}</Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.infoRow}>
//         <Ionicons name="mail-outline" size={20} color={Colors.primary} />
//         <View style={styles.infoText}>
//           <Text style={styles.infoLabel}>Email</Text>
//           <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.infoRow}>
//         <Ionicons name="shield-checkmark-outline" size={20} color={'#22c55e'} />
//         <View style={styles.infoText}>
//           <Text style={styles.infoLabel}>Account Status</Text>
//           <Text style={[styles.infoValue, { color: '#22c55e' }]}>Verified ✓</Text>
//         </View>
//       </View>
//     </View>

//     <View style={[styles.card, { marginTop: 12 }]}>
//       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
//         <Ionicons name="log-out-outline" size={20} color="#fff" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   </ScrollView>
// );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: Colors.background },
//     header: {
//         paddingTop: Platform.OS === 'web' ? 80 : 70,
//         paddingBottom: 40,
//         alignItems: 'center',
//         gap: 8,
//     },
//     avatarWrap: {
//         width: 88,
//         height: 88,
//         borderRadius: 44,
//         backgroundColor: 'rgba(255,255,255,0.25)',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 8,
//     },
//     avatarText: { fontSize: 36, fontWeight: '800', color: 'white' },
//     name: { fontSize: 22, fontWeight: '700', color: 'white' },
//     email: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
//     card: {
//         backgroundColor: Colors.card,
//         marginHorizontal: 16,
//         marginTop: -20,
//         borderRadius: 20,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.06,
//         shadowRadius: 12,
//         elevation: 4,
//     },
//     sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
//     infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
//     infoText: { flex: 1 },
//     infoLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
//     infoValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
//     divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
//     logoutBtn: {
//         backgroundColor: '#ef4444',
//         borderRadius: 14,
//         height: 52,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//     },
//     logoutText: { fontSize: 16, fontWeight: '700', color: 'white' },
//     editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
// editText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
// inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, height: 52, gap: 10 },
// input: { flex: 1, fontSize: 15, color: Colors.text },
// label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
// });




import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@/shared/lib/auth';
import { useTheme } from '@/shared/theme/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark', icon: 'moon-outline' },
    { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

export default function ProfileScreen() {
    const { user, logout, updateProfile } = useAuth();
    const { colors: Colors, mode, setMode } = useTheme();
    const { user: clerkUser } = useUser();

    const [editing, setEditing] = useState(false);
    const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] ?? '');
    const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') ?? '');
    const [saving, setSaving] = useState(false);

    const [changingPass, setChangingPass] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [passSaving, setPassSaving] = useState(false);
    const [passError, setPassError] = useState('');

    const handleLogout = async () => { await logout(); };

    const handleSave = async () => {
        setSaving(true);
        await updateProfile(firstName, lastName);
        setSaving(false);
        setEditing(false);
    };

    const handlePasswordChange = async () => {
        if (!currentPass.trim() || !newPass.trim()) { setPassError('Please fill in all fields'); return; }
        if (newPass.length < 8) { setPassError('Password must be at least 8 characters'); return; }
        setPassSaving(true);
        setPassError('');
        try {
            await clerkUser?.updatePassword({ currentPassword: currentPass, newPassword: newPass });
            setChangingPass(false);
            setCurrentPass('');
            setNewPass('');
            Alert.alert('Success', 'Password updated successfully!');
        } catch (err: any) {
            const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Failed to update password';
            setPassError(msg);
        } finally {
            setPassSaving(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
                <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() ?? '?'}</Text>
                </View>
                <Text style={styles.name}>{user?.name ?? 'User'}</Text>
                <Text style={styles.email}>{user?.email ?? ''}</Text>
            </LinearGradient>

            {/* Account Card */}
            <View style={[styles.card, { backgroundColor: Colors.card }]}>
                <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>Account</Text>

                <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(v => !v)}>
                    <Ionicons name={editing ? 'close-outline' : 'pencil-outline'} size={18} color={Colors.primary} />
                    <Text style={[styles.editText, { color: Colors.primary }]}>{editing ? 'Cancel' : 'Edit Profile'}</Text>
                </TouchableOpacity>

                {editing && (
                    <View style={{ marginBottom: 16 }}>
                        <Text style={[styles.label, { color: Colors.text }]}>First Name</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
                            <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
                            <TextInput style={[styles.input, { color: Colors.text }]} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor={Colors.textMuted} />
                        </View>
                        <Text style={[styles.label, { marginTop: 12, color: Colors.text }]}>Last Name</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
                            <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
                            <TextInput style={[styles.input, { color: Colors.text }]} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor={Colors.textMuted} />
                        </View>
                        <TouchableOpacity style={[styles.actionBtn, { marginTop: 16, backgroundColor: Colors.primary }]} onPress={handleSave} disabled={saving}>
                            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Save Changes</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} />
                    <View style={styles.infoText}>
                        <Text style={[styles.infoLabel, { color: Colors.textMuted }]}>Full Name</Text>
                        <Text style={[styles.infoValue, { color: Colors.text }]}>{user?.name ?? '-'}</Text>
                    </View>
                </View>
                <View style={[styles.divider, { backgroundColor: Colors.border }]} />
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                    <View style={styles.infoText}>
                        <Text style={[styles.infoLabel, { color: Colors.textMuted }]}>Email</Text>
                        <Text style={[styles.infoValue, { color: Colors.text }]}>{user?.email ?? '-'}</Text>
                    </View>
                </View>
                <View style={[styles.divider, { backgroundColor: Colors.border }]} />
                <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#22c55e" />
                    <View style={styles.infoText}>
                        <Text style={[styles.infoLabel, { color: Colors.textMuted }]}>Account Status</Text>
                        <Text style={[styles.infoValue, { color: '#22c55e' }]}>Verified ✓</Text>
                    </View>
                </View>
            </View>

            {/* Theme Card */}
            <View style={[styles.card, { backgroundColor: Colors.card, marginTop: 12 }]}>
                <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>Appearance</Text>
                <View style={styles.themeRow}>
                    {THEME_OPTIONS.map(opt => {
                        const isActive = mode === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => setMode(opt.value)}
                                activeOpacity={0.8}
                                style={[
                                    styles.themeChip,
                                    { borderColor: Colors.border, backgroundColor: Colors.background },
                                    isActive && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                                ]}
                            >
                                <Ionicons
                                    name={opt.icon as any}
                                    size={16}
                                    color={isActive ? 'white' : Colors.textMuted}
                                />
                                <Text style={[
                                    styles.themeChipText,
                                    { color: Colors.textMuted },
                                    isActive && { color: 'white', fontWeight: '700' },
                                ]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Change Password Card */}
            <View style={[styles.card, { backgroundColor: Colors.card, marginTop: 12 }]}>
                <TouchableOpacity style={styles.editBtn} onPress={() => {
                    setChangingPass(v => !v);
                    setPassError('');
                    setCurrentPass('');
                    setNewPass('');
                }}>
                    <Ionicons name={changingPass ? 'close-outline' : 'lock-closed-outline'} size={18} color={Colors.primary} />
                    <Text style={[styles.editText, { color: Colors.primary }]}>{changingPass ? 'Cancel' : 'Change Password'}</Text>
                </TouchableOpacity>

                {changingPass && (
                    <View>
                        {passError ? <Text style={styles.errorText}>{passError}</Text> : null}

                        <Text style={[styles.label, { color: Colors.text }]}>Current Password</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
                            <TextInput style={[styles.input, { color: Colors.text }]} value={currentPass} onChangeText={setCurrentPass} placeholder="Current password" placeholderTextColor={Colors.textMuted} secureTextEntry={!showCurrentPass} />
                            <TouchableOpacity onPress={() => setShowCurrentPass(v => !v)}>
                                <Ionicons name={showCurrentPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { marginTop: 12, color: Colors.text }]}>New Password</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.inputBg, borderColor: Colors.border }]}>
                            <Ionicons name="lock-open-outline" size={18} color={Colors.textMuted} />
                            <TextInput style={[styles.input, { color: Colors.text }]} value={newPass} onChangeText={setNewPass} placeholder="Min. 8 characters" placeholderTextColor={Colors.textMuted} secureTextEntry={!showNewPass} />
                            <TouchableOpacity onPress={() => setShowNewPass(v => !v)}>
                                <Ionicons name={showNewPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.actionBtn, { marginTop: 16, backgroundColor: Colors.primary }]} onPress={handlePasswordChange} disabled={passSaving}>
                            {passSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionBtnText}>Update Password</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Logout Card */}
            <View style={[styles.card, { backgroundColor: Colors.card, marginTop: 12, marginBottom: 32 }]}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: { paddingTop: Platform.OS === 'web' ? 80 : 70, paddingBottom: 40, alignItems: 'center', gap: 8 },
    avatarWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    avatarText: { fontSize: 36, fontWeight: '800', color: 'white' },
    name: { fontSize: 22, fontWeight: '700', color: 'white' },
    email: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
    card: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
    sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
    infoText: { flex: 1 },
    infoLabel: { fontSize: 12, marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1, marginVertical: 12 },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
    editText: { fontWeight: '600', fontSize: 14 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 52, gap: 10 },
    input: { flex: 1, fontSize: 15 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    errorText: { color: '#ef4444', marginBottom: 10, fontSize: 13 },
    actionBtn: { borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    actionBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
    // Theme toggle
    themeRow: { flexDirection: 'row', gap: 10 },
    themeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
    themeChipText: { fontSize: 13, fontWeight: '600' },
    // Logout
    logoutBtn: { backgroundColor: '#ef4444', borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    logoutText: { fontSize: 16, fontWeight: '700', color: 'white' },
});