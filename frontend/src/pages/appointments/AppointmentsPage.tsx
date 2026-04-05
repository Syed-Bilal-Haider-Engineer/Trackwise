import { useState, useMemo } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Platform, Alert, TextInput, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/shared/lib/auth';
import { useTheme } from '@/shared/theme/ThemeContext';

type AppointmentType = 'visa' | 'university' | 'doctor' | 'job' | 'government' | 'other';

type Appointment = {
    id: string;
    title: string;
    type: AppointmentType;
    date: string;
    time: string;
    location: string;
    notes: string;
    createdAt: string;
};

const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: string; color: string }[] = [
    { value: 'visa', label: 'Visa', icon: 'airplane-outline', color: '#2e6bff' },
    { value: 'university', label: 'University', icon: 'school-outline', color: '#06b6d4' },
    { value: 'doctor', label: 'Doctor', icon: 'medkit-outline', color: '#22c55e' },
    { value: 'job', label: 'Job', icon: 'briefcase-outline', color: '#8B5CF6' },
    { value: 'government', label: 'Government', icon: 'business-outline', color: '#f59e0b' },
    { value: 'other', label: 'Other', icon: 'calendar-outline', color: '#6b7280' },
];

function getUrgency(date: string): 'past' | 'today' | 'soon' | 'upcoming' {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appt = new Date(date);
    appt.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((appt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 7) return 'soon';
    return 'upcoming';
}

const URGENCY_COLORS = {
    past: { bg: '#f3f4f6', text: '#6b7280', label: 'Past' },
    today: { bg: '#fee2e2', text: '#dc2626', label: 'Today!' },
    soon: { bg: '#fef9c3', text: '#ca8a04', label: 'This Week' },
    upcoming: { bg: '#dcfce7', text: '#16a34a', label: 'Upcoming' },
};

export function AppointmentsPage() {
    const { user } = useAuth();
    const { colors: Colors } = useTheme();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [title, setTitle] = useState('');
    const [apptType, setApptType] = useState<AppointmentType>('visa');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

    const sorted = useMemo(() => {
        return [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments]);

    const upcoming = sorted.filter(a => getUrgency(a.date) !== 'past');
    const past = sorted.filter(a => getUrgency(a.date) === 'past');

    const handleAdd = () => {
        if (!title.trim() || !date.trim()) {
            Alert.alert('Error', 'Title and date are required');
            return;
        }
        const newAppt: Appointment = {
            id: Math.random().toString(36).slice(2),
            title: title.trim(),
            type: apptType,
            date,
            time: time.trim(),
            location: location.trim(),
            notes: notes.trim(),
            createdAt: new Date().toISOString(),
        };
        setAppointments(prev => [newAppt, ...prev]);
        setModalVisible(false);
        setTitle('');
        setApptType('visa');
        setDate('');
        setTime('');
        setLocation('');
        setNotes('');
    };

    const handleDelete = (id: string) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Delete this appointment?')) {
                setAppointments(prev => prev.filter(a => a.id !== id));
            }
        } else {
            Alert.alert('Delete', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => setAppointments(prev => prev.filter(a => a.id !== id)) },
            ]);
        }
    };

    const renderCard = (appt: Appointment) => {
        const typeInfo = APPOINTMENT_TYPES.find(t => t.value === appt.type) ?? APPOINTMENT_TYPES[5];
        const urgency = getUrgency(appt.date);
        const urgencyColor = URGENCY_COLORS[urgency];

        return (
            <View key={appt.id} style={[styles.apptCard, { backgroundColor: Colors.card }]}>
                <View style={[styles.apptAccent, { backgroundColor: typeInfo.color }]} />
                <View style={styles.apptBody}>
                    <View style={styles.apptTop}>
                        <View style={[styles.apptIconWrap, { backgroundColor: typeInfo.color + '18' }]}>
                            <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.apptTitle, { color: Colors.text }]}>{appt.title}</Text>
                            <Text style={[styles.apptType, { color: Colors.textMuted }]}>{typeInfo.label}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(appt.id)} style={[styles.deleteBtn, { backgroundColor: Colors.dangerLight }]}>
                            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.apptDivider, { backgroundColor: Colors.border }]} />

                    <View style={styles.apptBottom}>
                        <View style={styles.apptInfoRow}>
                            <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                            <Text style={[styles.apptInfo, { color: Colors.textSecondary }]}>{appt.date}{appt.time ? ` · ${appt.time}` : ''}</Text>
                        </View>
                        {appt.location ? (
                            <View style={styles.apptInfoRow}>
                                <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                                <Text style={[styles.apptInfo, { color: Colors.textSecondary }]}>{appt.location}</Text>
                            </View>
                        ) : null}
                        <View style={styles.apptBadgeRow}>
                            <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor.bg }]}>
                                <Text style={[styles.urgencyText, { color: urgencyColor.text }]}>{urgencyColor.label}</Text>
                            </View>
                        </View>
                        {appt.notes ? <Text style={[styles.apptNotes, { color: Colors.textSecondary }]}>{appt.notes}</Text> : null}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.root, { backgroundColor: Colors.background }]}>
            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Appointments</Text>
                        <Text style={styles.headerSub}>{upcoming.length} upcoming</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.addWrap} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                    <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.addBtn}>
                        <Ionicons name="add-circle-outline" size={20} color="white" />
                        <Text style={styles.addBtnText}>Add Appointment</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {appointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: Colors.card }]}>
                            <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: Colors.text }]}>No appointments yet</Text>
                        <Text style={[styles.emptyText, { color: Colors.textSecondary }]}>Add visa appointments, university meetings, and more.</Text>
                    </View>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>Upcoming</Text>
                                {upcoming.map(renderCard)}
                            </>
                        )}
                        {past.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: Colors.textMuted }]}>Past</Text>
                                {past.map(renderCard)}
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modal, { backgroundColor: Colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: Colors.border }]}>
                        <Text style={[styles.modalTitle, { color: Colors.text }]}>Add Appointment</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Title</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: Colors.text }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g. Visa Appointment"
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Type</Text>
                        <View style={styles.typeGrid}>
                            {APPOINTMENT_TYPES.map(t => (
                                <TouchableOpacity
                                    key={t.value}
                                    style={[styles.typeChip, { borderColor: Colors.border, backgroundColor: Colors.card }, apptType === t.value && { backgroundColor: t.color, borderColor: t.color }]}
                                    onPress={() => setApptType(t.value)}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={t.icon as any} size={14} color={apptType === t.value ? 'white' : Colors.textSecondary} />
                                    <Text style={[styles.typeChipText, { color: Colors.textSecondary }, apptType === t.value && { color: 'white' }]}>{t.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Date</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: Colors.text }]}
                                value={date}
                                onChangeText={setDate}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Time (optional)</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: Colors.text }]}
                                value={time}
                                onChangeText={setTime}
                                placeholder="HH:MM"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Location (optional)</Text>
                        <View style={[styles.inputRow, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: Colors.text }]}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="e.g. Ausländerbehörde Berlin"
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>

                        <Text style={[styles.fieldLabel, { color: Colors.text }]}>Notes (optional)</Text>
                        <View style={[styles.inputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12, backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { height: 60, color: Colors.text }]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Any additional notes..."
                                placeholderTextColor={Colors.textMuted}
                                multiline
                            />
                        </View>

                        <TouchableOpacity style={styles.saveWrap} onPress={handleAdd} activeOpacity={0.85}>
                            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.saveBtn}>
                                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                <Text style={styles.saveBtnText}>Save Appointment</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { paddingTop: Platform.OS === 'web' ? 56 : 54, paddingHorizontal: 20, paddingBottom: 24 },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
    avatarText: { fontSize: 15, fontWeight: '700', color: 'white' },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
    addWrap: { borderRadius: 14, overflow: 'hidden' },
    addBtn: { flexDirection: 'row', height: 52, alignItems: 'center', justifyContent: 'center', gap: 8 },
    addBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyIcon: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 },
    apptCard: { borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    apptAccent: { width: 4 },
    apptBody: { flex: 1, padding: 14 },
    apptTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    apptIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    apptTitle: { fontSize: 15, fontWeight: '700' },
    apptType: { fontSize: 12, marginTop: 2 },
    deleteBtn: { padding: 6, borderRadius: 8 },
    apptDivider: { height: 1, marginVertical: 10 },
    apptBottom: { gap: 6 },
    apptInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    apptInfo: { fontSize: 13 },
    apptBadgeRow: { flexDirection: 'row', gap: 6 },
    urgencyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
    urgencyText: { fontSize: 12, fontWeight: '600' },
    apptNotes: { fontSize: 12 },
    modal: { flex: 1 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    modalContent: { padding: 20, gap: 8, paddingBottom: 40 },
    fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 52, gap: 10 },
    input: { flex: 1, fontSize: 15 },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
    typeChipText: { fontSize: 12, fontWeight: '600' },
    saveWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 16 },
    saveBtn: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});