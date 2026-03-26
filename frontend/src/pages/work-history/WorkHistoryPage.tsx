import { ScrollView, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useWorkEntries } from "@/features/work-log/model/queries";
import { hoursForEntry, dayTypeFromHours } from "@/entities/work-entry/lib/time";

export function WorkHistoryPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const workEntries = useWorkEntries();

  const entries = workEntries.data ?? [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 12 }}>
      <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
        {t("history.title")}
      </Text>

      {entries.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>{t("history.empty")}</Text>
      ) : (
        entries.map((e) => {
          const hours = hoursForEntry(e);
          const dayType = dayTypeFromHours(hours);
          return (
            <Card key={e.id} style={{ borderRadius: theme.roundness }}>
              <Card.Content style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                    {e.jobTitle}
                  </Text>
                  <Text variant="labelLarge" style={{ opacity: 0.7 }}>
                    {e.date}
                  </Text>
                </View>

                <Divider />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ opacity: 0.75 }}>
                    {e.startTime} → {e.endTime}
                  </Text>
                  <Text style={{ fontWeight: "700" }}>{hours.toFixed(1)}h</Text>
                </View>

                <Text style={{ opacity: 0.7 }}>
                  {dayType === "full" ? t("legal.fullDay") : t("legal.halfDay")}
                </Text>
              </Card.Content>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}

