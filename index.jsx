import { useEffect } from "react";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../utils/auth/useAuth";
import { useTheme } from "../utils/theme";

export default function Index() {
  const { isAuthenticated, isReady } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Show loading screen while checking auth status
  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style={colors.statusBar} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 8,
          }}
        >
          TrueBond
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.textSecondary,
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  // Redirect based on auth status
  if (!isAuthenticated) {
    return <Redirect href="/onboarding" />;
  }

  // If authenticated, go to main app
  return <Redirect href="/(tabs)/discover" />;
}
