import { Tabs } from "expo-router";
import { Heart, MessageCircle, User, Crown } from "lucide-react-native";
import { useTheme } from "../../utils/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          paddingHorizontal: 8,
          height: insets.bottom + 64,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Heart
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          tabBarIcon: ({ color, focused }) => (
            <MessageCircle
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium",
          tabBarIcon: ({ color, focused }) => (
            <Crown
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User
              color={color}
              size={24}
              fill={focused ? color : "transparent"}
              strokeWidth={2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
