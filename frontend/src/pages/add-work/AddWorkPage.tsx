import { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import type { JobType, WorkEntry } from '@/entities/work-entry/types';
import { hoursForEntry, dayTypeFromHours } from '@/entities/work-entry/lib/time';
import { createId } from '@/shared/lib/uuid';
import { isoDate, nowTimeHHmm } from '@/shared/lib/date';
import { useAddWorkEntry } from '@/features/work-log/model/queries';
import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';

const JOB_TYPES: { value: JobType; label: string; icon: string; color: string }[] = [
  { value: 'mini-job', label: 'Mini-Job', icon: 'cafe-outline', color: '#8B5CF6' },
  { value: 'part-time', label: 'Part-Time', icon: 'laptop-outline', color: Colors.primary },
  { value: 'full-time', label: 'Full-Time', icon: 'business-outline', color: Colors.safe },
];

export function AddWorkPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const add = useAddWorkEntry();

  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<JobType>('part-time');
  const [date, setDate] = useState(isoDate(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState(nowTimeHHmm());

  const preview = useMemo(() => {
    const hours = hoursForEntry({ startTime, endTime });
    const dayType = dayTypeFromHours(hours);
    return { hours, dayType };
  }, [startTime, endTime]);

  const canSave =
    jobTitle.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    /^\d{2}:\d{2}$/.test(startTime) &&
    /^\d{2}:\d{2}$/.test(endTime) &&
    preview.hours > 0;

  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const handleSave = async () => {
    if (!canSave) return;
    const entry: WorkEntry = {
      id: createId(),
      jobTitle: jobTitle.trim(),
      jobType,
      date,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
    };
    await add.mutateAsync(entry);
    Toast.show({ type: 'success', text1: '✅ ' + t('toast.added') });
    setJobTitle('');
    setJobType('part-time');
    setDate(isoDate(new Date()));
    setStartTime('09:00');
    setEndTime(nowTimeHHmm());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Add Work</Text>
            <Text style={styles.headerSub}>Log your working hours</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Job Title</Text>
          <View style={styles.inputRow}>
            <Ionicons name="briefcase-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="e.g. Waiter, Cleaner, Developer"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Job Type</Text>
          <View style={styles.typeRow}>
            {JOB_TYPES.map(jt => (
              <TouchableOpacity
                key={jt.value}
                style={[
                  styles.typeBtn,
                  jobType === jt.value && { backgroundColor: jt.color, borderColor: jt.color },
                ]}
                onPress={() => setJobType(jt.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={jt.icon as any}
                  size={16}
                  color={jobType === jt.value ? 'white' : Colors.textSecondary}
                />
                <Text style={[
                  styles.typeBtnText,
                  jobType === jt.value && { color: 'white' },
                ]}>
                  {jt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <View style={styles.timeRow}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>Start Time</Text>
            <View style={styles.inputRow}>
              <Ionicons name="play-outline" size={16} color={Colors.safe} />
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionLabel}>End Time</Text>
            <View style={styles.inputRow}>
              <Ionicons name="stop-outline" size={16} color={Colors.danger} />
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        </View>

        {preview.hours > 0 && (
          <View style={styles.previewCard}>
            <LinearGradient
              colors={['rgba(37,99,235,0.08)', 'rgba(124,58,237,0.08)']}
              style={styles.previewGrad}
            >
              <View style={styles.previewRow}>
                <View style={styles.previewItem}>
                  <Text style={styles.previewNum}>{preview.hours.toFixed(1)}h</Text>
                  <Text style={styles.previewLabel}>Duration</Text>
                </View>
                <View style={styles.previewDiv} />
                <View style={styles.previewItem}>
                  <Text style={[styles.previewNum, { color: Colors.primary }]}>
                    {preview.dayType === 'full' ? '1.0' : '0.5'}
                  </Text>
                  <Text style={styles.previewLabel}>Legal Days</Text>
                </View>
                <View style={styles.previewDiv} />
                <View style={styles.previewItem}>
                  <Text style={[styles.previewNum, {
                    color: preview.dayType === 'full' ? Colors.safe : Colors.warning,
                  }]}>
                    {preview.dayType === 'full' ? 'Full' : 'Half'}
                  </Text>
                  <Text style={styles.previewLabel}>Day Type</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveWrap, !canSave && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!canSave || add.isPending}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.saveBtn}>
            {add.isPending
              ? <ActivityIndicator color="white" />
              : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                  <Text style={styles.saveBtnText}>{t('workEntry.save')}</Text>
                </>
              )
            }
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.hintText}>
            German rule: &lt;4h = half day, ≥4h = full day (max 120/year)
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'web' ? 56 : 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: 'white' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: 'white' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 4 },
  section: { marginBottom: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  typeBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  timeRow: { flexDirection: 'row', gap: 12 },
  previewCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
  previewGrad: { padding: 16 },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  previewItem: { flex: 1, alignItems: 'center', gap: 4 },
  previewNum: { fontSize: 22, fontWeight: '800', color: Colors.text },
  previewLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  previewDiv: { width: 1, height: 32, backgroundColor: Colors.border },
  saveWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  saveBtn: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  hintText: { fontSize: 12, color: Colors.textMuted, flex: 1 },
});
