// export const Colors = {
//   primary: '#2563EB',
//   primaryDark: '#1D4ED8',
//   primaryLight: '#EFF6FF',
//   secondary: '#7C3AED',
//   secondaryLight: '#F5F3FF',

//   safe: '#10B981',
//   safeLight: '#ECFDF5',
//   safeDark: '#059669',
//   warning: '#F59E0B',
//   warningLight: '#FFFBEB',
//   warningDark: '#D97706',
//   danger: '#EF4444',
//   dangerLight: '#FEF2F2',
//   dangerDark: '#DC2626',

//   background: '#F1F5F9',
//   card: '#FFFFFF',
//   border: '#E2E8F0',
//   inputBg: '#F8FAFC',

//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textMuted: '#94A3B8',
//   textOnPrimary: '#FFFFFF',

//   gradientStart: '#2563EB',
//   gradientEnd: '#7C3AED',

//   tabActive: '#2563EB',
//   tabInactive: '#94A3B8',
// } as const;





// export const Colors = {
//   primary: '#6366F1',
//   primaryDark: '#4F46E5',
//   primaryLight: '#EEF2FF',
//   secondary: '#8B5CF6',
//   secondaryLight: '#F5F3FF',

//   safe: '#10B981',
//   safeLight: '#ECFDF5',
//   safeDark: '#059669',
//   warning: '#F59E0B',
//   warningLight: '#FFFBEB',
//   warningDark: '#D97706',
//   danger: '#EF4444',
//   dangerLight: '#FEF2F2',
//   dangerDark: '#DC2626',

//   background: '#F5F3FF',
//   card: '#FFFFFF',
//   border: '#E0E7FF',
//   inputBg: '#F5F3FF',

//   text: '#1E1B4B',
//   textSecondary: '#4338CA',
//   textMuted: '#A5B4FC',
//   tabActive: '#6366F1',
//   tabInactive: '#A5B4FC',
//   textOnPrimary: '#FFFFFF',

//   gradientStart: '#6366F1',
//   gradientEnd: '#4F46E5',
// } as const;


export const LightColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#EEF2FF',
  secondary: '#8B5CF6',
  secondaryLight: '#F5F3FF',

  safe: '#10B981',
  safeLight: '#ECFDF5',
  safeDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warningDark: '#D97706',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  dangerDark: '#DC2626',

  background: '#F5F3FF',
  card: '#FFFFFF',
  border: '#E0E7FF',
  inputBg: '#F8F7FF',

  text: '#1E1B4B',
  textSecondary: '#4338CA',
  textMuted: '#A5B4FC',
  tabActive: '#6366F1',
  tabInactive: '#A5B4FC',
  textOnPrimary: '#FFFFFF',

  gradientStart: '#6366F1',
  gradientEnd: '#4F46E5',
} as const;

export const DarkColors = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#1E1B4B',
  secondary: '#A78BFA',
  secondaryLight: '#2E1065',

  safe: '#34D399',
  safeLight: '#022C22',
  safeDark: '#10B981',
  warning: '#FCD34D',
  warningLight: '#1C1400',
  warningDark: '#F59E0B',
  danger: '#F87171',
  dangerLight: '#2D0000',
  dangerDark: '#EF4444',

  background: '#0F0E17',
  card: '#1A1829',
  border: '#2E2B50',
  inputBg: '#1A1829',

  text: '#EDE9FE',
  textSecondary: '#A5B4FC',
  textMuted: '#6366F1',
  tabActive: '#818CF8',
  tabInactive: '#4F46E5',
  textOnPrimary: '#FFFFFF',

  gradientStart: '#4F46E5',
  gradientEnd: '#3730A3',
} as const;

// Default export — overwrite hoga ThemeContext se
export const Colors = LightColors;
export type AppColors = typeof LightColors;