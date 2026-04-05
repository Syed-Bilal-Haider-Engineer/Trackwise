// import { useMemo, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import Toast from 'react-native-toast-message';
// import { useTranslation } from 'react-i18next';

// import type { JobType, WorkEntry } from '@/entities/work-entry/types';
// import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
// import { createId } from '@/shared/lib/uuid';
// import { isoDate, nowTimeHHmm } from '@/shared/lib/date';
// import { useAddWorkEntry } from '@/features/work-log/model/queries';
// import { useAuth } from '@/shared/lib/auth';
// import { Colors } from '@/shared/theme/colors';

// const JOB_TYPES: { value: JobType; label: string; icon: string; color: string }[] = [
//   { value: 'mini-job', label: 'Mini-Job', icon: 'cafe-outline', color: '#8B5CF6' },
//   { value: 'part-time', label: 'Part-Time', icon: 'laptop-outline', color: Colors.primary },
//   { value: 'full-time', label: 'Full-Time', icon: 'business-outline', color: Colors.safe },
// ];

// export function AddWorkPage() {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const add = useAddWorkEntry();

//   const [jobTitle, setJobTitle] = useState('');
//   const [jobType, setJobType] = useState<JobType>('part-time');
//   const [date, setDate] = useState(isoDate(new Date()));
//   const [startTime, setStartTime] = useState('09:00');
//   const [endTime, setEndTime] = useState(nowTimeHHmm());

//   const preview = useMemo(() => {
//     const hours = hoursForEntry({ startTime, endTime });
//     const dayType = dayTypeFromHours(hours);
//     return { hours, dayType };
//   }, [startTime, endTime]);

//   const canSave =
//     jobTitle.trim().length > 0 &&
//     /^\d{4}-\d{2}-\d{2}$/.test(date) &&
//     /^\d{2}:\d{2}$/.test(startTime) &&
//     /^\d{2}:\d{2}$/.test(endTime) &&
//     preview.hours > 0;

//   const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

//   const handleSave = async () => {
//     if (!canSave) return;
//     const entry: WorkEntry = {
//       id: createId(),
//       jobTitle: jobTitle.trim(),
//       jobType,
//       date,
//       startTime,
//       endTime,
//       createdAt: new Date().toISOString(),
//     };
//     await add.mutateAsync(entry);
//     Toast.show({ type: 'success', text1: '✅ ' + t('toast.added') });
//     setJobTitle('');
//     setJobType('part-time');
//     setDate(isoDate(new Date()));
//     setStartTime('09:00');
//     setEndTime(nowTimeHHmm());
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: Colors.background }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.headerTitle}>Add Work</Text>
//             <Text style={styles.headerSub}>Log your working hours</Text>
//           </View>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>{initials}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Job Title</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="briefcase-outline" size={18} color={Colors.textMuted} />
//             <TextInput
//               style={styles.input}
//               value={jobTitle}
//               onChangeText={setJobTitle}
//               placeholder="e.g. Waiter, Cleaner, Developer"
//               placeholderTextColor={Colors.textMuted}
//               autoCapitalize="words"
//             />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Job Type</Text>
//           <View style={styles.typeRow}>
//             {JOB_TYPES.map(jt => (
//               <TouchableOpacity
//                 key={jt.value}
//                 style={[
//                   styles.typeBtn,
//                   jobType === jt.value && { backgroundColor: jt.color, borderColor: jt.color },
//                 ]}
//                 onPress={() => setJobType(jt.value)}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name={jt.icon as any}
//                   size={16}
//                   color={jobType === jt.value ? 'white' : Colors.textSecondary}
//                 />
//                 <Text style={[
//                   styles.typeBtnText,
//                   jobType === jt.value && { color: 'white' },
//                 ]}>
//                   {jt.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionLabel}>Date</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
//             <TextInput
//               style={styles.input}
//               value={date}
//               onChangeText={setDate}
//               placeholder="YYYY-MM-DD"
//               placeholderTextColor={Colors.textMuted}
//               keyboardType="numbers-and-punctuation"
//             />
//           </View>
//         </View>

//         <View style={styles.timeRow}>
//           <View style={[styles.section, { flex: 1 }]}>
//             <Text style={styles.sectionLabel}>Start Time</Text>
//             <View style={styles.inputRow}>
//               <Ionicons name="play-outline" size={16} color={Colors.safe} />
//               <TextInput
//                 style={styles.input}
//                 value={startTime}
//                 onChangeText={setStartTime}
//                 placeholder="HH:MM"
//                 placeholderTextColor={Colors.textMuted}
//                 keyboardType="numbers-and-punctuation"
//               />
//             </View>
//           </View>
//           <View style={[styles.section, { flex: 1 }]}>
//             <Text style={styles.sectionLabel}>End Time</Text>
//             <View style={styles.inputRow}>
//               <Ionicons name="stop-outline" size={16} color={Colors.danger} />
//               <TextInput
//                 style={styles.input}
//                 value={endTime}
//                 onChangeText={setEndTime}
//                 placeholder="HH:MM"
//                 placeholderTextColor={Colors.textMuted}
//                 keyboardType="numbers-and-punctuation"
//               />
//             </View>
//           </View>
//         </View>

//         {preview.hours > 0 && (
//           <View style={styles.previewCard}>
//             <LinearGradient
//               colors={['rgba(37,99,235,0.08)', 'rgba(124,58,237,0.08)']}
//               style={styles.previewGrad}
//             >
//               <View style={styles.previewRow}>
//                 <View style={styles.previewItem}>
//                   <Text style={styles.previewNum}>{preview.hours.toFixed(1)}h</Text>
//                   <Text style={styles.previewLabel}>Duration</Text>
//                 </View>
//                 <View style={styles.previewDiv} />
//                 <View style={styles.previewItem}>
//                   <Text style={[styles.previewNum, { color: Colors.primary }]}>
//                     {preview.dayType === 'full' ? '1.0' : '0.5'}
//                   </Text>
//                   <Text style={styles.previewLabel}>Legal Days</Text>
//                 </View>
//                 <View style={styles.previewDiv} />
//                 <View style={styles.previewItem}>
//                   <Text style={[styles.previewNum, {
//                     color: preview.dayType === 'full' ? Colors.safe : Colors.warning,
//                   }]}>
//                     {preview.dayType === 'full' ? 'Full' : 'Half'}
//                   </Text>
//                   <Text style={styles.previewLabel}>Day Type</Text>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>
//         )}

//         <TouchableOpacity
//           style={[styles.saveWrap, !canSave && { opacity: 0.5 }]}
//           onPress={handleSave}
//           disabled={!canSave || add.isPending}
//           activeOpacity={0.85}
//         >
//           <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.saveBtn}>
//             {add.isPending
//               ? <ActivityIndicator color="white" />
//               : (
//                 <>
//                   <Ionicons name="checkmark-circle-outline" size={20} color="white" />
//                   <Text style={styles.saveBtnText}>{t('workEntry.save')}</Text>
//                 </>
//               )
//             }
//           </LinearGradient>
//         </TouchableOpacity>

//         <View style={styles.hint}>
//           <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
//           <Text style={styles.hintText}>
//             German rule: &lt;4h = half day, ≥4h = full day (max 120/year)
//           </Text>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
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
//   scrollContent: { padding: 16, paddingBottom: 40, gap: 4 },
//   section: { marginBottom: 14 },
//   sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.card,
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     paddingHorizontal: 14,
//     height: 52,
//     gap: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   input: { flex: 1, fontSize: 15, color: Colors.text },
//   typeRow: { flexDirection: 'row', gap: 8 },
//   typeBtn: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 5,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     backgroundColor: Colors.card,
//   },
//   typeBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
//   timeRow: { flexDirection: 'row', gap: 12 },
//   previewCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
//   previewGrad: { padding: 16 },
//   previewRow: { flexDirection: 'row', alignItems: 'center' },
//   previewItem: { flex: 1, alignItems: 'center', gap: 4 },
//   previewNum: { fontSize: 22, fontWeight: '800', color: Colors.text },
//   previewLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
//   previewDiv: { width: 1, height: 32, backgroundColor: Colors.border },
//   saveWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
//   saveBtn: {
//     height: 54,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   saveBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
//   hint: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   hintText: { fontSize: 12, color: Colors.textMuted, flex: 1 },
// });





import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Platform, Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/shared/lib/auth';
import { useTheme } from '@/shared/theme/ThemeContext';
import { useDocuments, DOC_TYPES, type DocType, type Document } from '@/shared/lib/useDocuments';
import { useAppointments, APPOINTMENT_TYPES, type AppointmentType, type Appointment } from '@/shared/lib/useAppointments';
import { useAddWorkEntry } from '@/features/work-log/model/queries';
import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
import { createId } from '@/shared/lib/uuid';
import { isoDate, nowTimeHHmm } from '@/shared/lib/date';
import type { JobType, WorkEntry } from '@/entities/work-entry/types';
import Toast from 'react-native-toast-message';

const JOB_TYPES: { value: JobType; label: string; icon: string; color?: string }[] = [
  { value: 'mini-job', label: 'Mini-Job', icon: 'cafe-outline', color: '#2e6bff' },
  { value: 'part-time', label: 'Part-Time', icon: 'laptop-outline', color: '#8B5CF6' },
  { value: 'full-time', label: 'Full-Time', icon: 'business-outline', color: '#22c55e' },
];

type ActiveModal = 'none' | 'work' | 'document' | 'appointment';

export function AddWorkPage() {
  const { colors: Colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const add = useAddWorkEntry();
  const { addDoc } = useDocuments();
  const { addAppointment } = useAppointments();

  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  // Work state
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<JobType>('part-time');
  const [date, setDate] = useState(isoDate(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState(nowTimeHHmm());
  const hours = hoursForEntry({ startTime, endTime });
  const dayType = dayTypeFromHours(hours);
  const canSaveWork = jobTitle.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(date) && hours > 0;

  const handleSaveWork = async () => {
    if (!canSaveWork) return;
    const entry: WorkEntry = {
      id: createId(), jobTitle: jobTitle.trim(), jobType,
      date, startTime, endTime, createdAt: new Date().toISOString(),
    };
    await add.mutateAsync(entry);
    Toast.show({ type: 'success', text1: '✅ Work entry saved!' });
    setJobTitle(''); setJobType('part-time');
    setDate(isoDate(new Date())); setStartTime('09:00'); setEndTime(nowTimeHHmm());
    setActiveModal('none');
  };

  // Document state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocType>('visa');
  const [expiryDate, setExpiryDate] = useState('');
  const [docNotes, setDocNotes] = useState('');

  const handleSaveDoc = () => {
    if (!docName.trim()) { Alert.alert('Error', 'Document name is required'); return; }
    addDoc({ id: createId(), name: docName.trim(), type: docType, expiryDate: expiryDate.trim() || null, notes: docNotes.trim(), createdAt: new Date().toISOString() });
    Toast.show({ type: 'success', text1: '✅ Document saved!' });
    setDocName(''); setDocType('visa'); setExpiryDate(''); setDocNotes('');
    setActiveModal('none');
  };

  // Appointment state
  const [apptTitle, setApptTitle] = useState('');
  const [apptType, setApptType] = useState<AppointmentType>('visa');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptLocation, setApptLocation] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  const handleSaveAppt = () => {
    if (!apptTitle.trim() || !apptDate.trim()) { Alert.alert('Error', 'Title and date are required'); return; }
    addAppointment({ id: createId(), title: apptTitle.trim(), type: apptType, date: apptDate, time: apptTime.trim(), location: apptLocation.trim(), notes: apptNotes.trim(), createdAt: new Date().toISOString() });
    Toast.show({ type: 'success', text1: '✅ Appointment saved!' });
    setApptTitle(''); setApptType('visa'); setApptDate(''); setApptTime(''); setApptLocation(''); setApptNotes('');
    setActiveModal('none');
  };

  const themedInputRow = { backgroundColor: Colors.card, borderColor: Colors.border };

  return (
    <View style={[styles.root, { backgroundColor: Colors.background }]}>
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Add New</Text>
            <Text style={styles.headerSub}>What would you like to add?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Work Entry */}
        <TouchableOpacity style={[styles.hubCard, { backgroundColor: Colors.card }]} onPress={() => setActiveModal('work')} activeOpacity={0.85}>
          <LinearGradient colors={['#2e6bff18', '#7c3aed18']} style={styles.hubGrad}>
            <View style={[styles.hubIcon, { backgroundColor: Colors.primary }]}>
              <Ionicons name="time-outline" size={28} color="white" />
            </View>
            <View style={styles.hubText}>
              <Text style={[styles.hubTitle, { color: Colors.text }]}>Log Work Hours</Text>
              <Text style={[styles.hubSub, { color: Colors.textSecondary }]}>Record your daily work entry</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Document */}
        <TouchableOpacity style={[styles.hubCard, { backgroundColor: Colors.card }]} onPress={() => setActiveModal('document')} activeOpacity={0.85}>
          <LinearGradient colors={['#22c55e18', '#06b6d418']} style={styles.hubGrad}>
            <View style={[styles.hubIcon, { backgroundColor: '#22c55e' }]}>
              <Ionicons name="document-text-outline" size={28} color="white" />
            </View>
            <View style={styles.hubText}>
              <Text style={[styles.hubTitle, { color: Colors.text }]}>Add Document</Text>
              <Text style={[styles.hubSub, { color: Colors.textSecondary }]}>Visa, health card, contracts...</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Appointment */}
        <TouchableOpacity style={[styles.hubCard, { backgroundColor: Colors.card }]} onPress={() => setActiveModal('appointment')} activeOpacity={0.85}>
          <LinearGradient colors={['#f59e0b18', '#ef444418']} style={styles.hubGrad}>
            <View style={[styles.hubIcon, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="calendar-outline" size={28} color="white" />
            </View>
            <View style={styles.hubText}>
              <Text style={[styles.hubTitle, { color: Colors.text }]}>Add Appointment</Text>
              <Text style={[styles.hubSub, { color: Colors.textSecondary }]}>Visa, university, doctor...</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Work Modal ── */}
      <Modal visible={activeModal === 'work'} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: Colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Log Work Hours</Text>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Job Title</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="briefcase-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={jobTitle} onChangeText={setJobTitle} placeholder="e.g. Waiter, Developer" placeholderTextColor={Colors.textMuted} autoCapitalize="words" />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Job Type</Text>
            <View style={styles.typeRow}>
              {JOB_TYPES.map(jt => (
                <TouchableOpacity
                  key={jt.value}
                  style={[styles.typeChip, { backgroundColor: Colors.card, borderColor: Colors.border }, jobType === jt.value && { backgroundColor: jt.color, borderColor: jt.color }]}
                  onPress={() => setJobType(jt.value)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={jt.icon as any} size={14} color={jobType === jt.value ? 'white' : Colors.textSecondary} />
                  <Text style={[styles.typeChipText, { color: Colors.textSecondary }, jobType === jt.value && { color: 'white' }]}>{jt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Date</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
            </View>

            <View style={styles.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: Colors.text }]}>Start Time</Text>
                <View style={[styles.inputRow, themedInputRow]}>
                  <Ionicons name="play-outline" size={16} color={Colors.safe} />
                  <TextInput style={[styles.input, { color: Colors.text }]} value={startTime} onChangeText={setStartTime} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: Colors.text }]}>End Time</Text>
                <View style={[styles.inputRow, themedInputRow]}>
                  <Ionicons name="stop-outline" size={16} color={Colors.danger} />
                  <TextInput style={[styles.input, { color: Colors.text }]} value={endTime} onChangeText={setEndTime} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
                </View>
              </View>
            </View>

            {hours > 0 && (
              <View style={[styles.previewCard, { backgroundColor: Colors.primaryLight }]}>
                <Text style={[styles.previewItem, { color: Colors.primary }]}>⏱ {hours.toFixed(1)}h</Text>
                <Text style={[styles.previewItem, { color: Colors.text }]}>📅 {dayType === 'full' ? '1.0 Full Day' : '0.5 Half Day'}</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.saveWrap, !canSaveWork && { opacity: 0.5 }]} onPress={handleSaveWork} disabled={!canSaveWork || add.isPending} activeOpacity={0.85}>
              <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.saveBtn}>
                {add.isPending ? <ActivityIndicator color="white" /> : <><Ionicons name="checkmark-circle-outline" size={20} color="white" /><Text style={styles.saveBtnText}>Save Work Entry</Text></>}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Document Modal ── */}
      <Modal visible={activeModal === 'document'} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: Colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Add Document</Text>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Document Name</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="document-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={docName} onChangeText={setDocName} placeholder="e.g. Student Visa" placeholderTextColor={Colors.textMuted} />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Document Type</Text>
            <View style={styles.typeGrid}>
              {DOC_TYPES.map(t => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.typeChip, { backgroundColor: Colors.card, borderColor: Colors.border }, docType === t.value && { backgroundColor: t.color, borderColor: t.color }]}
                  onPress={() => setDocType(t.value)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={t.icon as any} size={14} color={docType === t.value ? 'white' : Colors.textSecondary} />
                  <Text style={[styles.typeChipText, { color: Colors.textSecondary }, docType === t.value && { color: 'white' }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Expiry Date (optional)</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={expiryDate} onChangeText={setExpiryDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Notes (optional)</Text>
            <View style={[styles.inputRow, themedInputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
              <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { height: 60, color: Colors.text }]} value={docNotes} onChangeText={setDocNotes} placeholder="Any additional notes..." placeholderTextColor={Colors.textMuted} multiline />
            </View>

            <TouchableOpacity style={styles.saveWrap} onPress={handleSaveDoc} activeOpacity={0.85}>
              <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.saveBtn}>
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                <Text style={styles.saveBtnText}>Save Document</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Appointment Modal ── */}
      <Modal visible={activeModal === 'appointment'} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: Colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: Colors.border }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Add Appointment</Text>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Title</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={apptTitle} onChangeText={setApptTitle} placeholder="e.g. Visa Appointment" placeholderTextColor={Colors.textMuted} />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Type</Text>
            <View style={styles.typeGrid}>
              {APPOINTMENT_TYPES.map(t => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.typeChip, { backgroundColor: Colors.card, borderColor: Colors.border }, apptType === t.value && { backgroundColor: t.color, borderColor: t.color }]}
                  onPress={() => setApptType(t.value)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={t.icon as any} size={14} color={apptType === t.value ? 'white' : Colors.textSecondary} />
                  <Text style={[styles.typeChipText, { color: Colors.textSecondary }, apptType === t.value && { color: 'white' }]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Date</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={apptDate} onChangeText={setApptDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Time (optional)</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={apptTime} onChangeText={setApptTime} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} keyboardType="numbers-and-punctuation" />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Location (optional)</Text>
            <View style={[styles.inputRow, themedInputRow]}>
              <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { color: Colors.text }]} value={apptLocation} onChangeText={setApptLocation} placeholder="e.g. Ausländerbehörde Berlin" placeholderTextColor={Colors.textMuted} />
            </View>

            <Text style={[styles.fieldLabel, { color: Colors.text }]}>Notes (optional)</Text>
            <View style={[styles.inputRow, themedInputRow, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
              <Ionicons name="create-outline" size={18} color={Colors.textMuted} />
              <TextInput style={[styles.input, { height: 60, color: Colors.text }]} value={apptNotes} onChangeText={setApptNotes} placeholder="Any additional notes..." placeholderTextColor={Colors.textMuted} multiline />
            </View>

            <TouchableOpacity style={styles.saveWrap} onPress={handleSaveAppt} activeOpacity={0.85}>
              <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.saveBtn}>
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
  scrollContent: { padding: 16, gap: 14, paddingBottom: 40 },
  hubCard: { borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  hubGrad: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  hubIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  hubText: { flex: 1 },
  hubTitle: { fontSize: 16, fontWeight: '700' },
  hubSub: { fontSize: 13, marginTop: 3 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalContent: { padding: 20, gap: 8, paddingBottom: 40 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 52, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  input: { flex: 1, fontSize: 15 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  typeChipText: { fontSize: 12, fontWeight: '600' },
  timeRow: { flexDirection: 'row', gap: 12 },
  previewCard: { flexDirection: 'row', gap: 16, borderRadius: 12, padding: 14, justifyContent: 'center' },
  previewItem: { fontSize: 15, fontWeight: '700' },
  saveWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  saveBtn: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
});