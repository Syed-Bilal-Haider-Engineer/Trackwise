import { MD3LightTheme, type MD3Theme } from "react-native-paper";

export const theme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 18,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2B6EF2",
    secondary: "#22C55E",
    tertiary: "#F59E0B",
    error: "#EF4444",
    surface: "#FFFFFF",
    background: "#F6F7FB",
  },
};

