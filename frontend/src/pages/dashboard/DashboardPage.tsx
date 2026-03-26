import { useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/lib/auth';
import { Colors } from '@/shared/theme/colors';
import { useWorkEntries } from '@/features/work-log/model/queries';
import { seedIfNeeded } from '@/features/work-log/model/seed';
import { dayTypeFromHours } from '@/entities/work-entry/lib/time';
import {
  filterToday,
  getMonthlySummary,
  getWeeklySummary,
  getYearlyLegalSummary,
  sumHours,
} from '@/features/work-log/model/summary';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={pb.track}>
      <View style={[pb.fill, { width: `${Math.min(1, pct) * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}
const pb = StyleSheet.create({
  track: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginTop: 10 },
  fill: { height: 8, borderRadius: 4 },
});

export function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const workEntries = useWorkEntries();

  useEffect(() => {
    seedIfNeeded().then(() => workEntries.refetch());
  }, []);

  const entries = useMemo(() => workEntries.data ?? [], [workEntries.data]);
  const todayEntries = useMemo(() => filterToday(entries), [entries]);
  const todayHours = useMemo(() => sumHours(todayEntries), [todayEntries]);
  const todayDayType = useMemo(() => dayTypeFromHours(todayHours), [todayHours]);

  const weekly = useMemo(() => getWeeklySummary(entries, 20), [entries]);
  const monthly = useMemo(() => getMonthlySummary(entries), [entries]);
  const yearly = useMemo(() => getYearlyLegalSummary(entries, 120, 0.8), [entries]);

  const weeklyPct = weekly.safeLimitHours > 0 ? weekly.hours / weekly.safeLimitHours : 0;
  const yearlyPct = yearly.percentUsed;

  const statusColor =
    yearly.status === 'danger' ? Colors.danger :
    yearly.status === 'warning' ? Colors.warning : Colors.safe;
  const statusBg =
    yearly.status === 'danger' ? Colors.dangerLight :
    yearly.status === 'warning' ? Colors.warningLight : Colors.safeLight;

  const firstName = user?.name.split(' ')[0] ?? 'there';
  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  useEffect(() => {
    if (!entries.length) return;
    if (yearly.status === 'danger') {
      Toast.show({ type: 'error', text1: `❌ ${t('dashboard.exceededLimit')}` });
    } else if (yearly.status === 'warning') {
      Toast.show({ type: 'info', text1: `⚠️ ${t('dashboard.closeToLimit')}` });
    }
  }, [yearly.status, entries.length]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()}, {firstName}!</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={logout} activeOpacity={0.8}>
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroLabel}>Today</Text>
            <Text style={styles.heroHours}>{todayHours.toFixed(1)}h</Text>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>
                {todayDayType === 'full' ? '☀️ Full Day' : '🌤️ Half Day'}
              </Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Ionicons name="briefcase-outline" size={28} color="rgba(255,255,255,0.6)" />
            <Text style={styles.heroStatNum}>{todayEntries.length}</Text>
            <Text style={styles.heroStatLabel}>entries</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {yearly.status !== 'safe' && (
          <View style={[styles.alertBanner, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Ionicons
              name={yearly.status === 'danger' ? 'alert-circle' : 'warning'}
              size={18}
              color={statusColor}
            />
            <Text style={[styles.alertText, { color: statusColor }]}>
              {yearly.status === 'danger'
                ? t('dashboard.exceededLimit')
                : t('dashboard.closeToLimit')}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={[styles.iconBubble, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>This Week</Text>
              <Text style={styles.cardSub}>20h safe limit/week</Text>
            </View>
            <Text style={[styles.cardVal, {
              color: weeklyPct >= 1 ? Colors.danger : weeklyPct >= 0.8 ? Colors.warning : Colors.primary,
            }]}>
              {weekly.hours.toFixed(1)}h
            </Text>
          </View>
          <ProgressBar
            pct={weeklyPct}
            color={weeklyPct >= 1 ? Colors.danger : weeklyPct >= 0.8 ? Colors.warning : Colors.primary}
          />
          <Text style={styles.progressNote}>
            {weeklyPct >= 1
              ? '⚠️ Weekly limit reached'
              : `${((1 - weeklyPct) * weekly.safeLimitHours).toFixed(1)}h remaining this week`}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={[styles.iconBubble, { backgroundColor: Colors.secondaryLight }]}>
              <Ionicons name="stats-chart-outline" size={18} color={Colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>This Month</Text>
              <Text style={styles.cardSub}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <Text style={[styles.cardVal, { color: Colors.secondary }]}>
              {monthly.hours.toFixed(1)}h
            </Text>
          </View>
        </View>

        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: statusColor }]}>
          <View style={styles.cardHead}>
            <View style={[styles.iconBubble, { backgroundColor: statusBg }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={statusColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Yearly Legal Limit</Text>
              <Text style={styles.cardSub}>German 120 full-day rule</Text>
            </View>
            <Text style={[styles.cardVal, { color: statusColor }]}>
              {yearly.usedFullDayEquivalent.toFixed(1)}/120
            </Text>
          </View>
          <ProgressBar pct={yearlyPct} color={statusColor} />
          <View style={styles.yearlyRow}>
            <View style={styles.yearlyStat}>
              <Text style={[styles.yearlyNum, { color: Colors.text }]}>
                {yearly.usedFullDayEquivalent.toFixed(1)}
              </Text>
              <Text style={styles.yearlyLabel}>Days Used</Text>
            </View>
            <View style={styles.yearlyDiv} />
            <View style={styles.yearlyStat}>
              <Text style={[styles.yearlyNum, { color: statusColor }]}>
                {yearly.remainingFullDays.toFixed(1)}
              </Text>
              <Text style={styles.yearlyLabel}>Days Left</Text>
            </View>
            <View style={styles.yearlyDiv} />
            <View style={styles.yearlyStat}>
              <Text style={[styles.yearlyNum, { color: Colors.textSecondary }]}>
                {(yearlyPct * 100).toFixed(0)}%
              </Text>
              <Text style={styles.yearlyLabel}>Used</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.quickWrap}
          onPress={() => router.push('/(tabs)/work')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.quickBtn}>
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text style={styles.quickText}>Log Today's Work</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: Platform.OS === 'web' ? 56 : 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: 'white' },
  dateText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
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
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: { flex: 1 },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 2 },
  heroHours: { fontSize: 56, fontWeight: '800', color: 'white', lineHeight: 64 },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  dayBadgeText: { fontSize: 13, color: 'white', fontWeight: '600' },
  heroRight: { alignItems: 'center', gap: 4, paddingLeft: 16 },
  heroStatNum: { fontSize: 32, fontWeight: '800', color: 'white' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 14 },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  alertText: { flex: 1, fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  cardSub: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  cardVal: { fontSize: 20, fontWeight: '800' },
  progressNote: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  yearlyRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  yearlyStat: { flex: 1, alignItems: 'center', gap: 3 },
  yearlyNum: { fontSize: 20, fontWeight: '800' },
  yearlyLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  yearlyDiv: { width: 1, backgroundColor: Colors.border, marginVertical: 2 },
  quickWrap: { borderRadius: 14, overflow: 'hidden' },
  quickBtn: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickText: { fontSize: 15, fontWeight: '700', color: 'white' },
});
