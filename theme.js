import { useColorScheme } from "react-native";

// TrueBond color scheme based on spec
const lightTheme = {
  // Base colors
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceElevated: "#F8F9FA",
  surfaceCard: "#FFFFFF",

  // Text colors
  text: "#000000",
  textSecondary: "rgba(0,0,0,0.7)",
  textTertiary: "rgba(0,0,0,0.5)",

  // Brand colors - TrueBond palette
  primary: "#006400", // Primary dark green
  primaryLight: "#228B22",
  accent: "#00FF99", // Bright green accent
  secondary: "#181805", // Dark olive black

  // Semantic colors
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
  info: "#2196F3",

  // Border and divider colors
  border: "#E0E0E0",
  divider: "#F0F0F0",

  // Status bar
  statusBar: "dark",
};

const darkTheme = {
  // Base colors - Midnight Glow theme
  background: "#0A0A0A",
  surface: "#181805", // Secondary color from spec
  surfaceElevated: "#262622",
  surfaceCard: "#1A1A1A",

  // Text colors - off-white with controlled opacity
  text: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.7)",
  textTertiary: "rgba(255,255,255,0.5)",

  // Brand colors - TrueBond palette adapted for dark
  primary: "#228B22", // Slightly brighter green for dark mode
  primaryLight: "#32CD32",
  accent: "#00FF99", // Bright green accent (same as light)
  secondary: "#181805", // Dark olive black

  // Semantic colors (brightened for dark background)
  success: "#66BB6A",
  warning: "#FFA726",
  danger: "#EF5350",
  info: "#42A5F5",

  // Border and divider colors
  border: "rgba(255,255,255,0.15)",
  divider: "rgba(255,255,255,0.1)",

  // Status bar
  statusBar: "light",
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
  };
}

export { lightTheme, darkTheme };
