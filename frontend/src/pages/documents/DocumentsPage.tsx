import { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Platform, Alert, TextInput, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';

type DocType =
    | 'visa'
    | 'health-insurance'
    | 'residency-card'
    | 'id-card'
    | 'room-contract'
    | 'university-letter'
    | 'other';

type Document = {
    id: string;
    name: string;
    type: DocType;
    expiryDate: string | null;
    notes: string;
    createdAt: string;
};

const DOC_TYPES: { value: DocType; label: string; icon: string; color: string }[] = [
    { value: 'visa', label: 'Visa', icon: 'airplane-outline', color: '#2e6bff' },
    { value: 'health-insurance', label: 'Health Insurance', icon: 'medkit-outline', color: '#22c55e' },
    { value: 'residency-card', label: 'Residency Card', icon: 'card-outline', color: '#8B5CF6' },
    { value: 'id-card', label: 'ID Card', icon: 'person-circle-outline', color: '#f59e0b' },
    { value: 'room-contract', label: 'Room Contract', icon: 'home-outline', color: '#ef4444' },
    { value: 'university-letter', label: 'University Letter', icon: 'school-outline', color: '#06b6d4' },
    { value: 'other', label: 'Other', icon: 'document-outline', color: '#6b7280' },
];

function getStatus(expiryDate: string | null): 'valid' | 'soon' | 'expired' | 'none' {
    if (!expiryDate) return 'none';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 90) return 'soon';
    return 'valid';
}

function getStatusLabel(status: string, expiryDate: string | null): string {
    if (status === 'none') return 'No expiry';
    const expiry = new Date(expiryDate!);
    const diffDays = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (status === 'expired') return 'Expired';
    if (status === 'soon') return `Expires in ${diffDays} days`;
    return `Valid · ${expiry.toLocaleDateString('en-GB')}`;
}

const STATUS_COLORS = {
    valid: { bg: '#dcfce7', text: '#16a34a' },
    soon: { bg: '#fef9c3', text: '#ca8a04' },
    expired: { bg: '#fee2e2', text: '#dc2626' },
    none: { bg: Colors.border, text: Colors.textMuted },
};

export function DocumentsPage() {
    const { user } = useAuth();
    const [docs, setDocs] = useState<Document[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [docName, setDocName] = useState('');
    const [docType, setDocType] = useState<DocType>('visa');
    const [expiryDate, setExpiryDate] = useState('');
    const [notes, setNotes] = useState('');

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

    const handleAdd = () => {
        if (!docName.trim()) {
            Alert.alert('Error', 'Please enter document name');
            return;
        }
        const newDoc: Document = {
            id: Math.random().toString(36).slice(2),
            name: docName.trim(),
            type: docType,
            expiryDate: expiryDate.trim() || null,
            notes: notes.trim(),
            createdAt: new Date().toISOString(),
        };
        setDocs(prev => [newDoc, ...prev]);
        setModalVisible(false);
        setDocName('');
        setDocType('visa');
        setExpiryDate('');
        setNotes('');
    };

    // const handleDelete = (id: string) => {
    //     Alert.alert('Delete Document', 'Are you sure?', [
    //         { text: 'Cancel', style: 'cancel' },
    //         { text: 'Delete', style: 'destructive', onPress: () => setDocs(prev => prev.filter(d => d.id !== id)) },
    //     ]);
    // };

    const handleDelete = (id: string) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this document?')) {
                setDocs(prev => prev.filter(d => d.id !== id));
            }
        } else {
            Alert.alert('Delete Document', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => setDocs(prev => prev.filter(d => d.id !== id)) },
            ]);
        }
    };

    const expiringSoon = docs.filter(d => getStatus(d.expiryDate) === 'soon' || getStatus(d.expiryDate) === 'expired');

    return (
        <View style={styles.root}>
            <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Documents</Text>
                        <Text style={styles.headerSub}>{docs.length} document{docs.length !== 1 ? 's' : ''} stored</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {expiringSoon.length > 0 && (
                    <View style={styles.alertBanner}>
                        <Ionicons name="warning" size={18} color="#ca8a04" />
                        <Text style={styles.alertText}>
                            {expiringSoon.length} document{expiringSoon.length > 1 ? 's' : ''} expiring soon or expired!
                        </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.addWrap} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
                    <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.addBtn}>
                        <Ionicons name="add-circle-outline" size={20} color="white" />
                        <Text style={styles.addBtnText}>Add Document</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {docs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>No documents yet</Text>
                        <Text style={styles.emptyText}>Add your visa, health insurance, and other important documents.</Text>
                    </View>
                ) : (
                    docs.map(doc => {
                        const typeInfo = DOC_TYPES.find(t => t.value === doc.type) ?? DOC_TYPES[6];
                        const status = getStatus(doc.expiryDate);
                        const statusColor = STATUS_COLORS[status];
                        return (
                            <View key={doc.id} style={styles.docCard}>
                                <View style={[styles.docAccent, { backgroundColor: typeInfo.color }]} />
                                <View style={styles.docBody}>
                                    <View style={styles.docTop}>
                                        <View style={[styles.docIconWrap, { backgroundColor: typeInfo.color + '18' }]}>
                                            <Ionicons name={typeInfo.icon as any} size={20} color={typeInfo.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.docName}>{doc.name}</Text>
                                            <Text style={styles.docType}>{typeInfo.label}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDelete(doc.id)} style={styles.deleteBtn}>
                                            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.docDivider} />

                                    <View style={styles.docBottom}>
                                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                                            <Ionicons
                                                name={status === 'expired' ? 'close-circle' : status === 'soon' ? 'warning' : 'checkmark-circle'}
                                                size={13}
                                                color={statusColor.text}
                                            />
                                            <Text style={[styles.statusText, { color: statusColor.text }]}>
                                                {getStatusLabel(status, doc.expiryDate)}
                                            </Text>
                                        </View>
                                        {doc.notes ? <Text style={styles.docNotes}>{doc.notes}</Text> : null}
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Document</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.fieldLabel}>Document Name</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="document-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                value={docName}
                                onChangeText={setDocName}
                                placeholder="e.g. Student Visa"
                                placeholderTextColor={Colors.textMuted}
                            />
                        </View>

                        <Text style={styles.fieldLabel}>Document Type</Text>
                        <View style={styles.typeGrid}>
                            {DOC_TYPES.map(t => (
                                <TouchableOpacity
                                    key={t.value}
                                    style={[styles.typeChip, docType === t.value && { backgroundColor: t.color, borderColor: t.color }]}
                                    onPress={() => setDocType(t.value)}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={t.icon as any} size={14} color={docType === t.value ? 'white' : Colors.textSecondary} />
                                    <Text style={[styles.typeChipText, docType === t.value && { color: 'white' }]}>{t.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.fieldLabel}>Expiry Date (optional)</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        <Text style={styles.fieldLabel}>Notes (optional)</Text>
                        <View style={[styles.inputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                            <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
                            <TextInput
                                style={[styles.input, { height: 60 }]}
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
                                <Text style={styles.saveBtnText}>Save Document</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    header: { paddingTop: Platform.OS === 'web' ? 56 : 54, paddingHorizontal: 20, paddingBottom: 24 },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
    avatarText: { fontSize: 15, fontWeight: '700', color: 'white' },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
    alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef9c3', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fde68a', gap: 10 },
    alertText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#ca8a04' },
    addWrap: { borderRadius: 14, overflow: 'hidden' },
    addBtn: { flexDirection: 'row', height: 52, alignItems: 'center', justifyContent: 'center', gap: 8 },
    addBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyIcon: { width: 96, height: 96, borderRadius: 24, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
    emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
    docCard: { backgroundColor: Colors.card, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    docAccent: { width: 4 },
    docBody: { flex: 1, padding: 14 },
    docTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    docIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    docName: { fontSize: 15, fontWeight: '700', color: Colors.text },
    docType: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    deleteBtn: { padding: 6, borderRadius: 8, backgroundColor: Colors.dangerLight },
    docDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
    docBottom: { gap: 6 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
    statusText: { fontSize: 12, fontWeight: '600' },
    docNotes: { fontSize: 12, color: Colors.textSecondary },
    modal: { flex: 1, backgroundColor: Colors.background },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
    modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
    modalContent: { padding: 20, gap: 8, paddingBottom: 40 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, height: 52, gap: 10 },
    input: { flex: 1, fontSize: 15, color: Colors.text },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card },
    typeChipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
    saveWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 16 },
    saveBtn: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});