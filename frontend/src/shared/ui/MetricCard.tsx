import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export function MetricCard({ title, value, subtitle, tone = "neutral" }: Props) {
  const theme = useTheme();

  const toneColor =
    tone === "success"
      ? theme.colors.secondary
      : tone === "warning"
        ? theme.colors.tertiary
        : tone === "danger"
          ? theme.colors.error
          : theme.colors.primary;

  return (
    <Card style={{ borderRadius: theme.roundness, overflow: "hidden" }}>
      <View style={{ height: 4, backgroundColor: toneColor }} />
      <Card.Content style={{ paddingTop: 14 }}>
        <Text variant="labelLarge" style={{ opacity: 0.75 }}>
          {title}
        </Text>
        <Text variant="headlineMedium" style={{ marginTop: 6 }}>
          {value}
        </Text>
        {subtitle ? (
          <Text variant="bodyMedium" style={{ marginTop: 6, opacity: 0.7 }}>
            {subtitle}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}

