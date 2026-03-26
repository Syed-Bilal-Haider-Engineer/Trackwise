import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, useTheme, ProgressBar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { useWorkEntries } from "@/features/work-log/model/queries";
import { seedIfNeeded } from "@/features/work-log/model/seed";
import { dayTypeFromHours } from "@/entities/work-entry/lib/time";
import {
  filterToday,
  getMonthlySummary,
  getWeeklySummary,
  getYearlyLegalSummary,
  sumHours,
} from "@/features/work-log/model/summary";
import { MetricCard } from "@/shared/ui/MetricCard";

export function DashboardPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const workEntries = useWorkEntries();

  useEffect(() => {
    seedIfNeeded().then(() => workEntries.refetch());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entries = useMemo(() => workEntries.data ?? [], [workEntries.data]);

  const todayHours = useMemo(() => {
    const today = filterToday(entries);
    return sumHours(today);
  }, [entries]);

  const todayDayType = useMemo(() => dayTypeFromHours(todayHours), [todayHours]);

  const weekly = useMemo(() => getWeeklySummary(entries, 20), [entries]);
  const monthly = useMemo(() => getMonthlySummary(entries), [entries]);
  const yearly = useMemo(() => getYearlyLegalSummary(entries, 120, 0.8), [entries]);

  useEffect(() => {
    if (!entries.length) return;

    if (yearly.status === "danger") {
      Toast.show({ type: "error", text1: `❌ ${t("dashboard.exceededLimit")}` });
      return;
    }
    if (yearly.status === "warning") {
      Toast.show({ type: "info", text1: `⚠️ ${t("dashboard.closeToLimit")}` });
    }
  }, [entries.length, t, yearly.status]);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const todayHasEntry = filterToday(entries).length > 0;
    if (!todayHasEntry && hour >= 18) {
      Toast.show({ type: "info", text1: t("dashboard.dontForgetToday") });
    }
  }, [entries, t]);

  const weeklyProgress = weekly.safeLimitHours <= 0 ? 0 : Math.min(1, weekly.hours / weekly.safeLimitHours);

  const yearlyTone =
    yearly.status === "danger" ? "danger" : yearly.status === "warning" ? "warning" : "success";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 14 }}
    >
      <LinearGradient
        colors={["#0EA5E9", theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: theme.roundness,
          padding: 18,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        }}
      >
        <Text variant="titleMedium" style={{ color: "white", opacity: 0.9 }}>
          {t("dashboard.today")}
        </Text>
        <Text variant="displaySmall" style={{ color: "white", marginTop: 6, fontWeight: "700" }}>
          {todayHours.toFixed(1)}h
        </Text>
        <Text variant="bodyMedium" style={{ color: "white", opacity: 0.9, marginTop: 4 }}>
          {todayDayType === "full" ? t("legal.fullDay") : t("legal.halfDay")}
        </Text>
      </LinearGradient>

      {todayHours >= 8 ? (
        <MetricCard title={t("dashboard.today")} value={t("dashboard.completedToday")} tone="danger" />
      ) : null}

      <View style={{ gap: 12 }}>
        <MetricCard
          title={t("dashboard.weekly")}
          value={`${weekly.hours.toFixed(1)}/${weekly.safeLimitHours}h`}
          subtitle={t("dashboard.weekly")}
          tone={weeklyProgress >= 1 ? "danger" : weeklyProgress >= 0.8 ? "warning" : "success"}
        />
        <View style={{ marginTop: -6 }}>
          <ProgressBar progress={weeklyProgress} color={weeklyProgress >= 0.8 ? theme.colors.tertiary : theme.colors.secondary} />
        </View>

        <MetricCard title={t("dashboard.monthly")} value={`${monthly.hours.toFixed(1)}h`} tone="neutral" />

        <MetricCard
          title={t("dashboard.yearly")}
          value={`${yearly.usedFullDayEquivalent.toFixed(1)}/120`}
          subtitle={`${t("dashboard.remainingDays")}: ${yearly.remainingFullDays.toFixed(1)}`}
          tone={yearlyTone}
        />
        <ProgressBar
          progress={Math.min(1, yearly.percentUsed)}
          color={
            yearly.status === "danger"
              ? theme.colors.error
              : yearly.status === "warning"
                ? theme.colors.tertiary
                : theme.colors.secondary
          }
        />
      </View>
    </ScrollView>
  );
}

