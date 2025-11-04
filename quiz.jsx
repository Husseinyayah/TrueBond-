import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useTheme } from "../../utils/theme";
import { useAuth } from "../../utils/auth/useAuth";

const { width, height } = Dimensions.get("window");

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { auth } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const questions = [
    {
      id: "dating_goal",
      type: "single",
      title: "What are you looking for?",
      subtitle: "Help us understand your dating goals",
      options: [
        { id: "long-term", label: "Long-term relationship", emoji: "💕" },
        { id: "casual", label: "Something casual", emoji: "😊" },
        { id: "friendship", label: "Friendship first", emoji: "🤝" },
        { id: "not-sure", label: "Not sure yet", emoji: "🤔" },
      ],
    },
    {
      id: "values",
      type: "multiple",
      title: "What matters most to you?",
      subtitle: "Select all that apply",
      options: [
        { id: "family", label: "Family & relationships", emoji: "👨‍👩‍👧‍👦" },
        { id: "career", label: "Career & ambition", emoji: "💼" },
        { id: "adventure", label: "Travel & adventure", emoji: "🌍" },
        { id: "health", label: "Health & fitness", emoji: "💪" },
        { id: "creativity", label: "Art & creativity", emoji: "🎨" },
        { id: "spirituality", label: "Spirituality", emoji: "🙏" },
      ],
    },
    {
      id: "lifestyle",
      type: "single",
      title: "Describe your ideal evening",
      subtitle: "What sounds most appealing?",
      options: [
        { id: "quiet-home", label: "Quiet night at home", emoji: "🏠" },
        { id: "dinner-out", label: "Nice dinner out", emoji: "🍽️" },
        { id: "city-lights", label: "Exploring the city", emoji: "🌃" },
        { id: "nature", label: "Outdoor activities", emoji: "🌲" },
      ],
    },
    {
      id: "communication",
      type: "single",
      title: "How do you prefer to communicate?",
      subtitle: "Your communication style",
      options: [
        {
          id: "quick-texts",
          label: "Quick texts throughout the day",
          emoji: "💬",
        },
        { id: "long-chats", label: "Long, deep conversations", emoji: "🗣️" },
        {
          id: "voice-calls",
          label: "Voice calls and audio messages",
          emoji: "📞",
        },
        { id: "in-person", label: "Prefer meeting in person", emoji: "👥" },
      ],
    },
    {
      id: "deal_breakers",
      type: "multiple",
      title: "What are your deal-breakers?",
      subtitle: "Select any that apply",
      options: [
        { id: "smoking", label: "Smoking", emoji: "🚭" },
        { id: "no-pets", label: "No pets allowed", emoji: "🐕" },
        {
          id: "different-goals",
          label: "Very different life goals",
          emoji: "🎯",
        },
        { id: "poor-communication", label: "Poor communication", emoji: "💬" },
        { id: "dishonesty", label: "Dishonesty", emoji: "🚫" },
      ],
    },
  ];

  const handleAnswer = (questionId, optionId, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId)
        : [...currentAnswers, optionId];

      setAnswers((prev) => ({
        ...prev,
        [questionId]: newAnswers,
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    const hasAnswer =
      answers[currentQ.id] &&
      (Array.isArray(answers[currentQ.id])
        ? answers[currentQ.id].length > 0
        : true);

    if (!hasAnswer) {
      Alert.alert(
        "Please answer",
        "Please select at least one option to continue.",
      );
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quiz/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: auth?.uid,
          answers,
        }),
      });

      if (response.ok) {
        router.replace("/onboarding/profile");
      } else {
        throw new Error("Failed to save quiz results");
      }
    } catch (error) {
      console.error("Quiz save error:", error);
      Alert.alert("Error", "Failed to save your answers. Please try again.");
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

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBar} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={handlePrevious}
            style={{
              opacity: currentQuestion === 0 ? 0.3 : 1,
              padding: 8,
            }}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 18,
              color: colors.text,
            }}
          >
            TrueBond Quiz
          </Text>

          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            {currentQuestion + 1}/{questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: 32,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 28,
              color: colors.text,
              textAlign: "center",
              marginBottom: 12,
              lineHeight: 36,
            }}
          >
            {currentQ.title}
          </Text>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            {currentQ.subtitle}
          </Text>
        </View>

        {/* Options */}
        <View style={{ gap: 16 }}>
          {currentQ.options.map((option) => {
            const isSelected =
              currentQ.type === "multiple"
                ? (answers[currentQ.id] || []).includes(option.id)
                : answers[currentQ.id] === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                onPress={() =>
                  handleAnswer(
                    currentQ.id,
                    option.id,
                    currentQ.type === "multiple",
                  )
                }
                style={{
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : colors.border,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    marginRight: 16,
                  }}
                >
                  {option.emoji}
                </Text>

                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: isSelected ? "#FFFFFF" : colors.text,
                    flex: 1,
                  }}
                >
                  {option.label}
                </Text>

                {currentQ.type === "multiple" && isSelected && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.accent,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Heart size={14} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action */}
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
          onPress={handleNext}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            {loading
              ? "Saving..."
              : currentQuestion === questions.length - 1
                ? "Complete Quiz"
                : "Continue"}
          </Text>
          {!loading && <ChevronRight size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
