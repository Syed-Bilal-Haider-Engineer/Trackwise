import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
                <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name ?? 'User'}</Text>
                <Text style={styles.email}>{user?.email ?? ''}</Text>
            </LinearGradient>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Account</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} />
                    <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{user?.name ?? '-'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                    <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success ?? '#22c55e'} />
                    <View style={styles.infoText}>
                        <Text style={styles.infoLabel}>Account Status</Text>
                        <Text style={[styles.infoValue, { color: Colors.success ?? '#22c55e' }]}>Verified ✓</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.card, { marginTop: 12 }]}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        paddingTop: Platform.OS === 'web' ? 80 : 70,
        paddingBottom: 40,
        alignItems: 'center',
        gap: 8,
    },
    avatarWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: { fontSize: 36, fontWeight: '800', color: 'white' },
    name: { fontSize: 22, fontWeight: '700', color: 'white' },
    email: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
    card: {
        backgroundColor: Colors.card,
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
    infoText: { flex: 1 },
    infoLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
    infoValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
    divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
    logoutBtn: {
        backgroundColor: '#ef4444',
        borderRadius: 14,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoutText: { fontSize: 16, fontWeight: '700', color: 'white' },
});