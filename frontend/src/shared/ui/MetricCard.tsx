import { View, Text, StyleSheet } from 'react-native';
// import { Colors } from '@/shared/theme/colors';
import { useTheme } from '@/shared/theme/ThemeContext';

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};

export function MetricCard({ title, value, subtitle, tone = 'neutral' }: Props) {
  const color =
    tone === 'success' ? Colors.safe :
    tone === 'warning' ? Colors.warning :
    tone === 'danger' ? Colors.danger :
    Colors.primary;

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  accent: { width: 4 },
  body: { flex: 1, padding: 16 },
  title: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
});
