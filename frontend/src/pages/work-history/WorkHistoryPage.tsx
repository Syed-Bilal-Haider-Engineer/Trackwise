// import { useState } from 'react';
// import {
//   View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useTranslation } from 'react-i18next';

// import { useAuth } from '@/shared/lib/auth';
// import { Colors } from '@/shared/theme/colors';
// import { useWorkEntries, useDeleteWorkEntry } from '@/features/work-log/model/queries';
// import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
// import type { WorkEntry } from '@/entities/work-entry/types';

// const JOB_TYPE_COLORS: Record<string, string> = {
//   'mini-job': '#8B5CF6',
//   'part-time': Colors.primary,
//   'full-time': Colors.safe,
// };

// const JOB_TYPE_LABELS: Record<string, string> = {
//   'mini-job': 'Mini-Job',
//   'part-time': 'Part-Time',
//   'full-time': 'Full-Time',
// };

// function EntryCard({
//   entry,
//   onDelete,
// }: {
//   entry: WorkEntry;
//   onDelete: (id: string) => void;
// }) {
//   const hours = hoursForEntry(entry);
//   const dayType = dayTypeFromHours(hours);
//   const typeColor = JOB_TYPE_COLORS[entry.jobType] ?? Colors.primary;
//   const dayColor = dayType === 'full' ? Colors.safe : Colors.warning;

//   return (
//     <View style={card.wrap}>
//       <View style={[card.accent, { backgroundColor: typeColor }]} />
//       <View style={card.body}>
//         <View style={card.top}>
//           <View style={{ flex: 1 }}>
//             <Text style={card.title} numberOfLines={1}>{entry.jobTitle}</Text>
//             <Text style={card.date}>
//               <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} /> {entry.date}
//             </Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => onDelete(entry.id)}
//             style={card.deleteBtn}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="trash-outline" size={16} color={Colors.danger} />
//           </TouchableOpacity>
//         </View>

//         <View style={card.divider} />

//         <View style={card.bottom}>
//           <View style={card.timeBox}>
//             <Ionicons name="play-outline" size={13} color={Colors.safe} />
//             <Text style={card.timeText}>{entry.startTime}</Text>
//             <Ionicons name="remove-outline" size={13} color={Colors.textMuted} />
//             <Ionicons name="stop-outline" size={13} color={Colors.danger} />
//             <Text style={card.timeText}>{entry.endTime}</Text>
//           </View>

//           <View style={card.badges}>
//             <View style={[card.badge, { backgroundColor: typeColor + '18' }]}>
//               <Text style={[card.badgeText, { color: typeColor }]}>
//                 {JOB_TYPE_LABELS[entry.jobType] ?? entry.jobType}
//               </Text>
//             </View>
//             <View style={[card.badge, { backgroundColor: dayColor + '18' }]}>
//               <Text style={[card.badgeText, { color: dayColor }]}>
//                 {dayType === 'full' ? '☀️ Full' : '🌤️ Half'}
//               </Text>
//             </View>
//             <View style={[card.badge, { backgroundColor: Colors.primaryLight }]}>
//               <Text style={[card.badgeText, { color: Colors.primary }]}>
//                 {hours.toFixed(1)}h
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const card = StyleSheet.create({
//   wrap: {
//     backgroundColor: Colors.card,
//     borderRadius: 16,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   accent: { width: 4 },
//   body: { flex: 1, padding: 14 },
//   top: { flexDirection: 'row', alignItems: 'flex-start' },
//   title: { fontSize: 15, fontWeight: '700', color: Colors.text },
//   date: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
//   deleteBtn: {
//     padding: 6,
//     borderRadius: 8,
//     backgroundColor: Colors.dangerLight,
//     marginLeft: 8,
//   },
//   divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
//   bottom: { gap: 8 },
//   timeBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   timeText: { fontSize: 13, fontWeight: '600', color: Colors.text },
//   badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
//   badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
//   badgeText: { fontSize: 12, fontWeight: '600' },
// });

// export function WorkHistoryPage() {
//   const { user } = useAuth();
//   const { t } = useTranslation();
//   const workEntries = useWorkEntries();
//   const deleteMutation = useDeleteWorkEntry();

//   const entries = workEntries.data ?? [];
//   const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

//   const handleDelete = (id: string) => {
//     if (Platform.OS === 'web') {
//       deleteMutation.mutate(id, {
//         onSuccess: () => Toast.show({ type: 'success', text1: t('toast.deleted') }),
//       });
//     } else {
//       Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             deleteMutation.mutate(id, {
//               onSuccess: () => Toast.show({ type: 'success', text1: t('toast.deleted') }),
//             });
//           },
//         },
//       ]);
//     }
//   };

//   return (
//     <View style={styles.root}>
//       <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.headerTitle}>Work History</Text>
//             <Text style={styles.headerSub}>
//               {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
//             </Text>
//           </View>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>{initials}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {entries.length === 0 ? (
//           <View style={styles.emptyState}>
//             <View style={styles.emptyIcon}>
//               <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
//             </View>
//             <Text style={styles.emptyTitle}>No entries yet</Text>
//             <Text style={styles.emptyText}>
//               Start logging your work hours to see your history here.
//             </Text>
//           </View>
//         ) : (
//           entries.map(entry => (
//             <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   header: {
//     paddingTop: Platform.OS === 'web' ? 56 : 54,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//   },
//   headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
//   headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.4)',
//   },
//   avatarText: { fontSize: 15, fontWeight: '700', color: 'white' },
//   scroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
//   emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
//   emptyIcon: {
//     width: 96,
//     height: 96,
//     borderRadius: 24,
//     backgroundColor: Colors.card,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
//   emptyText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     paddingHorizontal: 32,
//     lineHeight: 20,
//   },
// });



import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';
import { useWorkEntries, useDeleteWorkEntry } from '@/features/work-log/model/queries';
import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
import type { WorkEntry } from '@/entities/work-entry/types';

const JOB_TYPE_COLORS: Record<string, string> = {
  'mini-job': '#8B5CF6',
  'part-time': Colors.primary,
  'full-time': Colors.safe,
};

const JOB_TYPE_LABELS: Record<string, string> = {
  'mini-job': 'Mini-Job',
  'part-time': 'Part-Time',
  'full-time': 'Full-Time',
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function EntryCard({ entry, onDelete }: { entry: WorkEntry; onDelete: (id: string) => void }) {
  const hours = hoursForEntry(entry);
  const dayType = dayTypeFromHours(hours);
  const typeColor = JOB_TYPE_COLORS[entry.jobType] ?? Colors.primary;
  const dayColor = dayType === 'full' ? Colors.safe : Colors.warning;

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

const card = StyleSheet.create({
  wrap: { backgroundColor: Colors.card, borderRadius: 16, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  accent: { width: 4 },
  body: { flex: 1, padding: 14 },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 15, fontWeight: '700', color: Colors.text },
  date: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
  deleteBtn: { padding: 6, borderRadius: 8, backgroundColor: Colors.dangerLight, marginLeft: 8 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  bottom: { gap: 8 },
  timeBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
});

export function WorkHistoryPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const workEntries = useWorkEntries();
  const deleteMutation = useDeleteWorkEntry();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear] = useState<number>(now.getFullYear());

  const entries = workEntries.data ?? [];
  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const d = new Date(entry.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [entries, selectedMonth, selectedYear]);

  const totalHours = useMemo(() => {
    return filteredEntries.reduce((sum, e) => sum + hoursForEntry(e), 0);
  }, [filteredEntries]);

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this entry?')) {
        deleteMutation.mutate(id, {
          onSuccess: () => Toast.show({ type: 'success', text1: t('toast.deleted') }),
        });
      }
    } else {
      Alert.alert('Delete Entry', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => deleteMutation.mutate(id, {
            onSuccess: () => Toast.show({ type: 'success', text1: t('toast.deleted') }),
          }),
        },
      ]);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Work History</Text>
            <Text style={styles.headerSub}>{filteredEntries.length} entries · {totalHours.toFixed(1)}h</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No entries for {MONTHS[selectedMonth]}</Text>
            <Text style={styles.emptyText}>Log your work hours to see them here.</Text>
          </View>
        ) : (
          filteredEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))
        )}
      </ScrollView>
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
  monthWrap: { backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  monthScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  monthChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  monthChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  monthText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  monthTextActive: { color: 'white' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { width: 96, height: 96, borderRadius: 24, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
});