import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/shared/lib/auth';
import { useTheme } from '@/shared/theme/ThemeContext';
import { useWorkEntries, useDeleteWorkEntry } from '@/features/work-log/model/queries';
import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
import type { WorkEntry } from '@/entities/work-entry/types';
import { useDocuments, DOC_TYPES, getDocStatus, type Document } from '@/shared/lib/useDocuments';
import { useAppointments, APPOINTMENT_TYPES, getUrgency, type Appointment } from '@/shared/lib/useAppointments';

// ─── Constants (Colors use nahi karte, isliye bahar safe hain) ───────────────

type ActiveTab = 'work' | 'docs' | 'appointments';

const JOB_TYPE_COLORS: Record<string, string> = {
  'mini-job': '#8B5CF6',
  'part-time': '#2e6bff',   // Colors.primary hardcoded fallback
  'full-time': '#22c55e',   // Colors.safe hardcoded fallback
};

const JOB_TYPE_LABELS: Record<string, string> = {
  'mini-job': 'Mini-Job',
  'part-time': 'Part-Time',
  'full-time': 'Full-Time',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Work Entry Card ──────────────────────────────────────────────────────────

function EntryCard({ entry, onDelete }: { entry: WorkEntry; onDelete: (id: string) => void }) {
  const { colors: Colors } = useTheme();
  const hours = hoursForEntry(entry);
  const dayType = dayTypeFromHours(hours);
  const typeColor = JOB_TYPE_COLORS[entry.jobType] ?? Colors.primary;
  const dayColor = dayType === 'full' ? Colors.safe : Colors.warning;

  const card = makeCardStyles(Colors);

  return (
    <View style={card.wrap}>
      <View style={[card.accent, { backgroundColor: typeColor }]} />
      <View style={card.body}>
        <View style={card.top}>
          <View style={{ flex: 1 }}>
            <Text style={card.title} numberOfLines={1}>{entry.jobTitle}</Text>
            <Text style={card.date}>{entry.date}</Text>
          </View>
          <TouchableOpacity onPress={() => onDelete(entry.id)} style={card.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
        <View style={card.divider} />
        <View style={card.bottom}>
          <View style={card.timeBox}>
            <Ionicons name="play-outline" size={13} color={Colors.safe} />
            <Text style={card.timeText}>{entry.startTime}</Text>
            <Ionicons name="remove-outline" size={13} color={Colors.textMuted} />
            <Ionicons name="stop-outline" size={13} color={Colors.danger} />
            <Text style={card.timeText}>{entry.endTime}</Text>
          </View>
          <View style={card.badges}>
            <View style={[card.badge, { backgroundColor: typeColor + '18' }]}>
              <Text style={[card.badgeText, { color: typeColor }]}>
                {JOB_TYPE_LABELS[entry.jobType] ?? entry.jobType}
              </Text>
            </View>
            <View style={[card.badge, { backgroundColor: dayColor + '18' }]}>
              <Text style={[card.badgeText, { color: dayColor }]}>
                {dayType === 'full' ? '☀️ Full' : '🌤 Half'}
              </Text>
            </View>
            <View style={[card.badge, { backgroundColor: Colors.primaryLight }]}>
              <Text style={[card.badgeText, { color: Colors.primary }]}>{hours.toFixed(1)}h</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocCard({ doc, onDelete }: { doc: Document; onDelete: (id: string) => void }) {
  const { colors: Colors } = useTheme();
  const card = makeCardStyles(Colors);
  const status = getDocStatus(doc.expiryDate);
  const typeInfo = DOC_TYPES.find(t => t.value === doc.type);

  const statusConfig = {
    valid:   { label: '✅ Valid',      color: Colors.safe },
    soon:    { label: '⚠️ Expiring',   color: Colors.warning },
    expired: { label: '❌ Expired',    color: Colors.danger },
    none:    { label: '📄 No Expiry',  color: Colors.textMuted },
  }[status];

  return (
    <View style={card.wrap}>
      <View style={[card.accent, { backgroundColor: typeInfo?.color ?? Colors.primary }]} />
      <View style={card.body}>
        <View style={card.top}>
          <View style={{ flex: 1 }}>
            <Text style={card.title} numberOfLines={1}>{doc.name}</Text>
            <Text style={card.date}>
              {doc.expiryDate ? `Expires: ${doc.expiryDate}` : 'No expiry date'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDelete(doc.id)} style={card.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
        <View style={card.divider} />
        <View style={card.badges}>
          <View style={[card.badge, { backgroundColor: (typeInfo?.color ?? Colors.primary) + '18' }]}>
            <Ionicons name={typeInfo?.icon as any} size={12} color={typeInfo?.color ?? Colors.primary} />
            <Text style={[card.badgeText, { color: typeInfo?.color ?? Colors.primary }]}>
              {typeInfo?.label ?? doc.type}
            </Text>
          </View>
          <View style={[card.badge, { backgroundColor: statusConfig.color + '18' }]}>
            <Text style={[card.badgeText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
        {doc.notes ? (
          <Text style={card.notes} numberOfLines={2}>{doc.notes}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────

function AppointmentCard({ appt, onDelete }: { appt: Appointment; onDelete: (id: string) => void }) {
  const { colors: Colors } = useTheme();
  const card = makeCardStyles(Colors);
  const urgency = getUrgency(appt.date);
  const typeInfo = APPOINTMENT_TYPES.find(t => t.value === appt.type);

  const urgencyConfig = {
    past:     { label: '✓ Past',      color: Colors.textMuted },
    today:    { label: '🔴 Today',    color: Colors.danger },
    soon:     { label: '⚠️ Soon',     color: Colors.warning },
    upcoming: { label: '🗓 Upcoming', color: Colors.safe },
  }[urgency];

  return (
    <View style={card.wrap}>
      <View style={[card.accent, { backgroundColor: urgencyConfig.color }]} />
      <View style={card.body}>
        <View style={card.top}>
          <View style={{ flex: 1 }}>
            <Text style={card.title} numberOfLines={1}>{appt.title}</Text>
            <Text style={card.date}>
              {appt.date}{appt.time ? ` · ${appt.time}` : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onDelete(appt.id)} style={card.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
          </TouchableOpacity>
        </View>
        <View style={card.divider} />
        <View style={card.badges}>
          <View style={[card.badge, { backgroundColor: (typeInfo?.color ?? Colors.primary) + '18' }]}>
            <Ionicons name={typeInfo?.icon as any} size={12} color={typeInfo?.color ?? Colors.primary} />
            <Text style={[card.badgeText, { color: typeInfo?.color ?? Colors.primary }]}>
              {typeInfo?.label ?? appt.type}
            </Text>
          </View>
          <View style={[card.badge, { backgroundColor: urgencyConfig.color + '18' }]}>
            <Text style={[card.badgeText, { color: urgencyConfig.color }]}>
              {urgencyConfig.label}
            </Text>
          </View>
        </View>
        {appt.location ? (
          <View style={card.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={card.notes} numberOfLines={1}>{appt.location}</Text>
          </View>
        ) : null}
        {appt.notes ? (
          <Text style={card.notes} numberOfLines={2}>{appt.notes}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Card Style Factory (Colors ke saath, component ke andar call hogi) ───────

function makeCardStyles(Colors: any) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: Colors.card, borderRadius: 16, flexDirection: 'row',
      overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    accent: { width: 4 },
    body: { flex: 1, padding: 14 },
    top: { flexDirection: 'row', alignItems: 'flex-start' },
    title: { fontSize: 15, fontWeight: '700', color: Colors.text },
    date: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
    deleteBtn: {
      padding: 6, borderRadius: 8,
      backgroundColor: Colors.dangerLight, marginLeft: 8,
    },
    divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
    bottom: { gap: 8 },
    timeBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeText: { fontSize: 13, fontWeight: '600', color: Colors.text },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 12, fontWeight: '600' },
    notes: { fontSize: 12, color: Colors.textSecondary, marginTop: 8, lineHeight: 18 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  });
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  const { colors: Colors } = useTheme();
  const styles = makeStyles(Colors);
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon as any} size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{sub}</Text>
    </View>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function WorkHistoryPage() {
  const { colors: Colors } = useTheme();
  const { user } = useAuth();
  const workEntries = useWorkEntries();
  const deleteMutation = useDeleteWorkEntry();
  const { docs, deleteDoc } = useDocuments();
  const { appointments, deleteAppointment } = useAppointments();

  const now = new Date();
  const [activeTab, setActiveTab] = useState<ActiveTab>('work');
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear] = useState<number>(now.getFullYear());

  const styles = makeStyles(Colors);

  const entries = workEntries.data ?? [];
  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const filteredEntries = useMemo(() => entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  }), [entries, selectedMonth, selectedYear]);

  const totalHours = useMemo(() =>
    filteredEntries.reduce((sum, e) => sum + hoursForEntry(e), 0),
    [filteredEntries]
  );

  // const filteredDocs = useMemo(() => docs.filter(d => {
  //   const created = new Date(d.createdAt);
  //   return created.getMonth() === selectedMonth && created.getFullYear() === selectedYear;
  // }), [docs, selectedMonth, selectedYear]);

  const filteredDocs = useMemo(() => docs.filter(d => {
    // ✅ expiryDate se filter karo, agar null ho toh createdAt fallback
    const dateStr = d.expiryDate ?? d.createdAt;
    const [year, month] = dateStr.split('-').map(Number);
    return (month - 1) === selectedMonth && year === selectedYear;
}), [docs, selectedMonth, selectedYear]);


  const filteredAppts = useMemo(() => appointments.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  }), [appointments, selectedMonth, selectedYear]);

  const headerSub = {
    work: `${filteredEntries.length} entries · ${totalHours.toFixed(1)}h`,
    docs: `${filteredDocs.length} documents`,
    appointments: `${filteredAppts.length} appointments`,
  }[activeTab];

  const handleDeleteWork = (id: string) => {
    const doDelete = () => deleteMutation.mutate(id, {
      onSuccess: () => Toast.show({ type: 'success', text1: '🗑 Entry deleted' }),
    });
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this entry?')) doDelete();
    } else {
      Alert.alert('Delete Entry', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleDeleteDoc = (id: string) => {
    const doDelete = () => {
      deleteDoc(id);
      Toast.show({ type: 'success', text1: '🗑 Document deleted' });
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this document?')) doDelete();
    } else {
      Alert.alert('Delete Document', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleDeleteAppt = (id: string) => {
    const doDelete = () => {
      deleteAppointment(id);
      Toast.show({ type: 'success', text1: '🗑 Appointment deleted' });
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this appointment?')) doDelete();
    } else {
      Alert.alert('Delete Appointment', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <View style={styles.root}>

      {/* Header */}
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSub}>{headerSub}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {([
            { key: 'work', label: 'Work', icon: 'time-outline' },
            { key: 'docs', label: 'Docs', icon: 'document-text-outline' },
            { key: 'appointments', label: 'Calendar', icon: 'calendar-outline' },
          ] as { key: ActiveTab; label: string; icon: string }[]).map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon as any}
                size={15}
                color={activeTab === tab.key ? Colors.primary : 'rgba(255,255,255,0.7)'}
              />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Month Filter */}
      <View style={styles.monthWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthScroll}>
          {MONTHS.map((month, index) => (
            <TouchableOpacity
              key={month}
              style={[styles.monthChip, selectedMonth === index && styles.monthChipActive]}
              onPress={() => setSelectedMonth(index)}
              activeOpacity={0.8}
            >
              <Text style={[styles.monthText, selectedMonth === index && styles.monthTextActive]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {activeTab === 'work' && (
          filteredEntries.length === 0
            ? <EmptyState icon="time-outline" title={`No work entries for ${MONTHS[selectedMonth]}`} sub="Log your work hours from the Add tab." />
            : filteredEntries.map(entry => <EntryCard key={entry.id} entry={entry} onDelete={handleDeleteWork} />)
        )}

        {activeTab === 'docs' && (
          filteredDocs.length === 0
            ? <EmptyState icon="document-text-outline" title={`No documents for ${MONTHS[selectedMonth]}`} sub="Add documents from the Add tab." />
            : filteredDocs.map(doc => <DocCard key={doc.id} doc={doc} onDelete={handleDeleteDoc} />)
        )}

        {activeTab === 'appointments' && (
          filteredAppts.length === 0
            ? <EmptyState icon="calendar-outline" title={`No appointments for ${MONTHS[selectedMonth]}`} sub="Add appointments from the Add tab." />
            : filteredAppts.map(appt => <AppointmentCard key={appt.id} appt={appt} onDelete={handleDeleteAppt} />)
        )}

      </ScrollView>
    </View>
  );
}

// ─── Style Factory ────────────────────────────────────────────────────────────

function makeStyles(Colors: any) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    header: {
      paddingTop: Platform.OS === 'web' ? 56 : 54,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    avatar: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    avatarText: { fontSize: 15, fontWeight: '700', color: 'white' },
    tabRow: {
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 14, padding: 4, gap: 4,
    },
    tabBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 5, paddingVertical: 8, borderRadius: 10,
    },
    tabBtnActive: { backgroundColor: 'white' },
    tabLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
    tabLabelActive: { color: Colors.primary },
    monthWrap: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
    monthScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    monthChip: {
      paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
      backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
    },
    monthChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    monthText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    monthTextActive: { color: 'white' },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyIcon: {
      width: 96, height: 96, borderRadius: 24,
      backgroundColor: Colors.card,
      alignItems: 'center', justifyContent: 'center',
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
    emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
  });
}