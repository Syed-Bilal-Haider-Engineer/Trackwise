import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button, Card, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import type { JobType, WorkEntry } from "@/entities/work-entry/types";
import { hoursForEntry, dayTypeFromHours } from "@/entities/work-entry/lib/time";
import { createId } from "@/shared/lib/uuid";
import { isoDate, nowTimeHHmm } from "@/shared/lib/date";
import { useAddWorkEntry } from "@/features/work-log/model/queries";

const jobTypeOptions: { value: JobType; i18nKey: string }[] = [
  { value: "mini-job", i18nKey: "jobType.miniJob" },
  { value: "part-time", i18nKey: "jobType.partTime" },
  { value: "full-time", i18nKey: "jobType.fullTime" },
];

export function AddWorkPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const add = useAddWorkEntry();

  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState<JobType>("part-time");
  const [date, setDate] = useState(isoDate(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState(nowTimeHHmm());

  const preview = useMemo(() => {
    const hours = hoursForEntry({ startTime, endTime });
    const dayType = dayTypeFromHours(hours);
    return { hours, dayType };
  }, [endTime, startTime]);

  const canSave = jobTitle.trim().length > 1 && /^\d{4}-\d{2}-\d{2}$/.test(date) && /^\d{2}:\d{2}$/.test(startTime) && /^\d{2}:\d{2}$/.test(endTime);

  async function onSave() {
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

    Toast.show({ type: "success", text1: t("toast.added") });

    setJobTitle("");
    setJobType("part-time");
    setDate(isoDate(new Date()));
    setStartTime("09:00");
    setEndTime(nowTimeHHmm());
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 14 }}>
        <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
          {t("workEntry.addTitle")}
        </Text>

        <Card style={{ borderRadius: theme.roundness }}>
          <Card.Content style={{ gap: 12 }}>
            <TextInput
              mode="outlined"
              label={t("workEntry.jobTitle")}
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="e.g., Waiter"
            />

            <View style={{ gap: 8 }}>
              <Text variant="labelLarge" style={{ opacity: 0.75 }}>
                {t("workEntry.jobType")}
              </Text>
              <SegmentedButtons
                value={jobType}
                onValueChange={(v) => setJobType(v as JobType)}
                buttons={jobTypeOptions.map((o) => ({ value: o.value, label: t(o.i18nKey) }))}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label={t("workEntry.date")}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label={t("workEntry.startTime")}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label={t("workEntry.endTime")}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                />
              </View>
            </View>

            <View
              style={{
                borderRadius: theme.roundness,
                backgroundColor: "rgba(43,110,242,0.08)",
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text variant="labelLarge" style={{ opacity: 0.75 }}>
                  Preview
                </Text>
                <Text variant="titleMedium" style={{ marginTop: 2 }}>
                  {preview.hours.toFixed(1)}h • {preview.dayType === "full" ? t("legal.fullDay") : t("legal.halfDay")}
                </Text>
              </View>
            </View>

            <Button mode="contained" onPress={onSave} disabled={!canSave || add.isPending} loading={add.isPending}>
              {t("workEntry.save")}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

