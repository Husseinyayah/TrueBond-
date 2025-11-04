import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin,
  Settings,
  X,
  Star,
  Heart,
  Filter,
  Sparkles,
  Shield,
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
import AdBanner from "../../components/AdBanner";
import AdNative from "../../components/AdNative";
import admobService from "../../utils/admob/AdMobService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    likesToday: 0,
    superLikesLeft: 5,
    matchesToday: 0,
  });

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Sample profiles for demo (replace with API call)
  useEffect(() => {
    const sampleProfiles = [
      {
        uid: "demo1",
        display_name: "Sarah",
        age: 24,
        photos: [
          "https://images.unsplash.com/photo-1494790108755-2616b612b2c5?w=400&h=600&fit=crop&crop=face",
        ],
        bio: "Adventure seeker, coffee enthusiast, and dog lover. Looking for someone to explore the world with!",
        location_city: "New York",
        distance_text: "2.1 km away",
        compatibility_score: 92,
        verified: true,
        interests: ["Travel", "Photography", "Hiking", "Coffee", "Art"],
      },
      {
        uid: "demo2",
        display_name: "Emma",
        age: 26,
        photos: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
        ],
        bio: "Artist and yoga instructor. Passionate about mindfulness and creativity.",
        location_city: "Brooklyn",
        distance_text: "5.4 km away",
        compatibility_score: 88,
        verified: false,
        interests: ["Yoga", "Art", "Meditation", "Music", "Books"],
      },
      {
        uid: "demo3",
        display_name: "Olivia",
        age: 23,
        photos: [
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
        ],
        bio: "Tech professional by day, chef by night. Always up for trying new restaurants!",
        location_city: "Manhattan",
        distance_text: "1.8 km away",
        compatibility_score: 95,
        verified: true,
        interests: ["Technology", "Cooking", "Food", "Travel", "Movies"],
      },
    ];

    setProfiles(sampleProfiles);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 0);
  }, []);

  const handleLike = useCallback(async () => {
    if (currentProfileIndex >= profiles.length) return;

    const currentProfile = profiles[currentProfileIndex];

    try {
      // Call API to record like
      const response = await fetch("/api/discovery/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUid: auth?.uid,
          toUid: currentProfile.uid,
          likeType: "like",
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.isMatch) {
          Alert.alert(
            "🎉 It's a Match!",
            `You and ${currentProfile.display_name} liked each other!`,
          );
          setDailyStats((prev) => ({
            ...prev,
            matchesToday: prev.matchesToday + 1,
          }));
        }

        setDailyStats((prev) => ({ ...prev, likesToday: prev.likesToday + 1 }));
      }
    } catch (error) {
      console.error("Like error:", error);
    }

    // Move to next profile
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0); // Loop back for demo
    }
  }, [currentProfileIndex, profiles, auth]);

  const handlePass = useCallback(() => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0); // Loop back for demo
    }
  }, [currentProfileIndex, profiles.length]);

  const handleSuperLike = useCallback(async () => {
    if (dailyStats.superLikesLeft <= 0) {
      Alert.alert(
        "No Super Likes Left",
        "You've used all your Super Likes for today!",
      );
      return;
    }

    const currentProfile = profiles[currentProfileIndex];

    try {
      const response = await fetch("/api/discovery/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUid: auth?.uid,
          toUid: currentProfile.uid,
          likeType: "super",
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.isMatch) {
          Alert.alert(
            "🎉 It's a Match!",
            `You and ${currentProfile.display_name} liked each other!`,
          );
          setDailyStats((prev) => ({
            ...prev,
            matchesToday: prev.matchesToday + 1,
          }));
        }

        setDailyStats((prev) => ({
          ...prev,
          superLikesLeft: prev.superLikesLeft - 1,
          likesToday: prev.likesToday + 1,
        }));
      }
    } catch (error) {
      console.error("Super like error:", error);
    }

    // Move to next profile
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  }, [currentProfileIndex, profiles, auth, dailyStats.superLikesLeft]);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={colors.statusBar} />
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style={colors.statusBar} />
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 16,
            color: colors.textSecondary,
          }}
        >
          Finding amazing people for you...
        </Text>
      </View>
    );
  }

  const currentProfile = profiles[currentProfileIndex];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBar} />

      {/* Fixed Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: isScrolled ? 1 : 0,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Logo */}
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 24,
              color: colors.primary,
            }}
          >
            TrueBond
          </Text>

          {/* Right: Settings and Filter */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surfaceElevated,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Filter
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surfaceElevated,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Settings
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 76,
          paddingBottom: insets.bottom + 80, // Extra padding for bottom banner ad
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Profile Card */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 24,
            overflow: "hidden",
            height: screenHeight * 0.65,
            position: "relative",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Image
            source={{ uri: currentProfile.photos[0] }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            resizeMode="cover"
          />

          {/* Gradient overlay for text readability */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 280,
            }}
          />

          {/* Verification Badge */}
          {currentProfile.verified && (
            <View
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                backgroundColor: colors.accent,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Shield size={14} color="#FFFFFF" fill="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 12,
                  color: "#FFFFFF",
                  marginLeft: 4,
                }}
              >
                Verified
              </Text>
            </View>
          )}

          {/* Compatibility Score */}
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              backgroundColor: "rgba(255,255,255,0.9)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Sparkles size={14} color={colors.primary} />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: colors.primary,
                marginLeft: 4,
              }}
            >
              {currentProfile.compatibility_score}% Match
            </Text>
          </View>

          {/* Profile Info */}
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 32,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              {currentProfile.display_name}, {currentProfile.age}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <MapPin size={16} color="#F1F1F1" strokeWidth={1.5} />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: "#F1F1F1",
                  marginLeft: 4,
                }}
              >
                {currentProfile.distance_text}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: "#F1F1F1",
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
              {currentProfile.bio}
            </Text>

            {/* Interest Chips */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {currentProfile.interests.slice(0, 4).map((interest, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    {interest}
                  </Text>
                </View>
              ))}
              {currentProfile.interests.length > 4 && (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    +{currentProfile.interests.length - 4}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Pass Button */}
          <TouchableOpacity
            onPress={handlePass}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <X size={24} color={colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>

          {/* Super Like Button */}
          <TouchableOpacity
            onPress={handleSuperLike}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.info,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: colors.info,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Star size={20} color="#FFFFFF" fill="#FFFFFF" />
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            onPress={handleLike}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Heart size={28} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Daily Stats */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-around",
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 24,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {dailyStats.likesToday}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Likes Today
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 24,
                color: colors.success,
                marginBottom: 4,
              }}
            >
              {dailyStats.matchesToday}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              New Matches
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 24,
                color: colors.warning,
                marginBottom: 4,
              }}
            >
              {dailyStats.superLikesLeft}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Super Likes
            </Text>
          </View>
        </View>

        {/* Native Ad - Inline with content */}
        <AdNative
          adUnitId={admobService.getAdUnitId("nativeAdvanced")}
          testMode={true}
          onAdLoaded={() => {
            console.log("Native ad loaded successfully");
            admobService.logAdEvent(
              "loaded",
              "native",
              admobService.getAdUnitId("nativeAdvanced"),
            );
          }}
          onAdFailedToLoad={(error) => {
            console.error("Native ad failed to load:", error);
            admobService.logAdEvent(
              "failed",
              "native",
              admobService.getAdUnitId("nativeAdvanced"),
            );
          }}
          onAdClicked={() => {
            console.log("Native ad clicked");
            admobService.logAdEvent(
              "clicked",
              "native",
              admobService.getAdUnitId("nativeAdvanced"),
            );
          }}
          style={{ marginBottom: 20 }}
        />
      </ScrollView>

      {/* Bottom Banner Ad */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom,
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingVertical: 8,
        }}
      >
        <AdBanner
          adUnitId={admobService.getAdUnitId("banner")}
          size="banner"
          testMode={true}
          onAdLoaded={() => {
            console.log("Banner ad loaded successfully");
            admobService.logAdEvent(
              "loaded",
              "banner",
              admobService.getAdUnitId("banner"),
            );
          }}
          onAdFailedToLoad={(error) => {
            console.error("Banner ad failed to load:", error);
            admobService.logAdEvent(
              "failed",
              "banner",
              admobService.getAdUnitId("banner"),
            );
          }}
          style={{
            marginHorizontal: 8,
            marginVertical: 4,
          }}
        />
      </View>
    </View>
  );
}
