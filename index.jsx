import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Heart, Shield, Globe, Users } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useTheme } from "../../utils/theme";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const slides = [
    {
      icon: Heart,
      title: "Authentic Connections",
      subtitle: "Find genuine romance built on trust and compatibility",
      description:
        "Our advanced matching algorithm connects you with people who share your values and relationship goals.",
      backgroundColor: colors.primary,
      accentColor: colors.accent,
    },
    {
      icon: Shield,
      title: "Safety First",
      subtitle: "Your privacy and security are our top priority",
      description:
        "Comprehensive verification, AI-powered moderation, and robust privacy controls keep you safe.",
      backgroundColor: colors.info,
      accentColor: colors.accent,
    },
    {
      icon: Globe,
      title: "Global Romance",
      subtitle: "Connect across borders with built-in translation",
      description:
        "Meet amazing people worldwide with real-time chat translation and cultural matching.",
      backgroundColor: colors.success,
      accentColor: colors.accent,
    },
    {
      icon: Users,
      title: "Quality Matches",
      subtitle: "Meaningful connections, not endless swiping",
      description:
        "Smart algorithms and compatibility scoring help you find people you genuinely connect with.",
      backgroundColor: colors.warning,
      accentColor: colors.accent,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      router.replace("/onboarding/auth");
    }
  };

  const handleSkip = () => {
    router.replace("/onboarding/auth");
  };

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
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
      <StatusBar style="light" />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={{ width, flex: 1 }}>
            <LinearGradient
              colors={[slide.backgroundColor, slide.backgroundColor + "99"]}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 40,
                paddingTop: insets.top + 60,
                paddingBottom: insets.bottom + 100,
              }}
            >
              {/* Icon with glow effect */}
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 40,
                  shadowColor: slide.accentColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 20,
                  elevation: 20,
                }}
              >
                <slide.icon size={48} color="#FFFFFF" strokeWidth={1.5} />
              </View>

              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 32,
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {slide.title}
              </Text>

              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                {slide.subtitle}
              </Text>

              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {slide.description}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Controls */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 20,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 24,
            color: "#FFFFFF",
          }}
        >
          TrueBond
        </Text>

        {/* Skip */}
        <TouchableOpacity onPress={handleSkip}>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 16,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 30,
          left: 40,
          right: 40,
        }}
      >
        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentSlide === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentSlide === index ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: colors.primary,
            }}
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
