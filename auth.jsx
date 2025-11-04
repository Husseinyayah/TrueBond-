import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Mail, Phone, ChevronLeft } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useTheme } from "../../utils/theme";
import { useAuth } from "../../utils/auth/useAuth";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { setAuth } = useAuth();
  const [authType, setAuthType] = useState("email"); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const handleSignUp = async () => {
    if (authType === "email" && !email.trim()) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (authType === "phone" && !phone.trim()) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Generate a temporary UID for demo purposes
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create user account via API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          email: authType === "email" ? email : null,
          phone: authType === "phone" ? phone : null,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account");
      }

      const userData = await response.json();

      // Set auth state
      setAuth({
        uid: userData.user.uid,
        email: userData.user.email,
        phone: userData.user.phone,
        role: userData.user.role,
      });

      // Navigate to quiz
      router.replace("/onboarding/quiz");
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={colors.statusBar} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={{ flex: 1 }}
      >
        <StatusBar style="light" />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <TouchableOpacity onPress={handleGoBack} style={{ marginRight: 16 }}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 24,
              color: "#FFFFFF",
            }}
          >
            TrueBond
          </Text>
        </View>

        {/* Content */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 40,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 32,
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Create Account
          </Text>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              marginBottom: 40,
              lineHeight: 24,
            }}
          >
            Join thousands of people finding meaningful connections on TrueBond
          </Text>

          {/* Auth Type Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => setAuthType("email")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  authType === "email" ? "#FFFFFF" : "transparent",
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Mail
                size={20}
                color={authType === "email" ? colors.primary : "#FFFFFF"}
              />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: authType === "email" ? colors.primary : "#FFFFFF",
                  marginLeft: 8,
                }}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAuthType("phone")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  authType === "phone" ? "#FFFFFF" : "transparent",
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Phone
                size={20}
                color={authType === "phone" ? colors.primary : "#FFFFFF"}
              />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: authType === "phone" ? colors.primary : "#FFFFFF",
                  marginLeft: 8,
                }}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Field */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 16,
            }}
          >
            <TextInput
              placeholder={
                authType === "email"
                  ? "Enter your email"
                  : "Enter your phone number"
              }
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={authType === "email" ? email : phone}
              onChangeText={authType === "email" ? setEmail : setPhone}
              keyboardType={
                authType === "email" ? "email-address" : "phone-pad"
              }
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#000000", // Ensure text is black for visibility
                minHeight: 24,
              }}
            />
          </View>

          {/* Password Field */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 16,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#000000",
                minHeight: 24,
              }}
            />
          </View>

          {/* Confirm Password Field */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 24,
            }}
          >
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#000000",
                minHeight: 24,
              }}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 24,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              {loading ? "Creating Account..." : "Continue"}
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
            You must be 18+ to use TrueBond.
          </Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
