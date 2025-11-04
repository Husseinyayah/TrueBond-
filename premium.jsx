import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Star,
  Crown,
  Heart,
  Eye,
  Zap,
  Shield,
  Globe,
  Check,
  Sparkles,
} from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useTheme } from "../../utils/theme";
import { useAuth } from "../../utils/auth/useAuth";

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { auth } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const plans = [
    {
      id: "monthly",
      title: "Monthly",
      price: "$9.99",
      period: "/month",
      badge: null,
      savings: null,
    },
    {
      id: "quarterly",
      title: "3 Months",
      price: "$27.99",
      period: "/3 months",
      badge: "Save 7%",
      savings: "Save $2",
    },
    {
      id: "yearly",
      title: "Annual",
      price: "$84.99",
      period: "/year",
      badge: "Best Value",
      savings: "Save $35",
    },
  ];

  const features = [
    {
      icon: Heart,
      title: "Unlimited Likes",
      description: "Like as many profiles as you want",
      free: "20 per day",
      premium: "Unlimited",
    },
    {
      icon: Star,
      title: "Super Likes",
      description: "Stand out with Super Likes",
      free: "1 per week",
      premium: "5 per day",
    },
    {
      icon: Eye,
      title: "See Who Liked You",
      description: "View everyone who liked your profile",
      free: false,
      premium: true,
    },
    {
      icon: Zap,
      title: "Profile Boost",
      description: "Get 10x more profile views",
      free: false,
      premium: "1 per week",
    },
    {
      icon: Globe,
      title: "Global Passport",
      description: "Connect with people anywhere",
      free: false,
      premium: true,
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get help when you need it",
      free: false,
      premium: true,
    },
    {
      icon: Sparkles,
      title: "Premium Badge",
      description: "Show you're serious about dating",
      free: false,
      premium: true,
    },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // In a real app, this would integrate with App Store/Play Store billing
      Alert.alert(
        "Subscription Coming Soon",
        `${plans.find((p) => p.id === selectedPlan)?.title} plan (${plans.find((p) => p.id === selectedPlan)?.price}) will be available in the next update!`,
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Subscription error:", error);
      Alert.alert("Error", "Failed to process subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={colors.statusBar} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBar} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Crown size={32} color="#FFFFFF" fill="#FFFFFF" />
          </View>

          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            TrueBond Premium
          </Text>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Unlock premium features and find meaningful connections faster
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pricing Plans */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 20,
              color: colors.text,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Choose Your Plan
          </Text>

          <View style={{ gap: 12 }}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                style={{
                  backgroundColor:
                    selectedPlan === plan.id ? colors.primary : colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor:
                    selectedPlan === plan.id ? colors.primary : colors.border,
                  position: "relative",
                }}
              >
                {plan.badge && (
                  <View
                    style={{
                      position: "absolute",
                      top: -8,
                      right: 16,
                      backgroundColor:
                        plan.id === "yearly" ? colors.accent : colors.warning,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 12,
                        color: "#FFFFFF",
                      }}
                    >
                      {plan.badge}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 18,
                        color:
                          selectedPlan === plan.id ? "#FFFFFF" : colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {plan.title}
                    </Text>

                    {plan.savings && (
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 14,
                          color:
                            selectedPlan === plan.id
                              ? "rgba(255,255,255,0.8)"
                              : colors.success,
                        }}
                      >
                        {plan.savings}
                      </Text>
                    )}
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "baseline" }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 24,
                          color:
                            selectedPlan === plan.id ? "#FFFFFF" : colors.text,
                        }}
                      >
                        {plan.price}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 14,
                          color:
                            selectedPlan === plan.id
                              ? "rgba(255,255,255,0.7)"
                              : colors.textSecondary,
                          marginLeft: 2,
                        }}
                      >
                        {plan.period}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedPlan === plan.id && (
                  <View
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.accent,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 20,
              color: colors.text,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Premium Features
          </Text>

          <View style={{ gap: 16 }}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <feature.icon size={20} color="#FFFFFF" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 16,
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {feature.title}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 14,
                        color: colors.textSecondary,
                        lineHeight: 20,
                      }}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 12,
                        color: colors.textTertiary,
                        marginBottom: 4,
                      }}
                    >
                      FREE
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: feature.free ? colors.text : colors.textTertiary,
                      }}
                    >
                      {feature.free || "❌"}
                    </Text>
                  </View>

                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 12,
                        color: colors.primary,
                        marginBottom: 4,
                      }}
                    >
                      PREMIUM
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: colors.primary,
                      }}
                    >
                      {typeof feature.premium === "boolean"
                        ? feature.premium
                          ? "✓"
                          : "❌"
                        : feature.premium}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits Summary */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 16,
            padding: 20,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: colors.text,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Why Choose Premium?
          </Text>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Premium members get 3x more matches and 5x more conversations. Join
            thousands who've found love with TrueBond Premium.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleSubscribe}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {loading
              ? "Processing..."
              : `Start ${plans.find((p) => p.id === selectedPlan)?.title} Plan`}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: "center",
            marginTop: 12,
            lineHeight: 16,
          }}
        >
          Cancel anytime. Auto-renewal can be turned off in Account Settings.
        </Text>
      </View>
    </View>
  );
}
