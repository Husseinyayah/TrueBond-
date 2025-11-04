import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  Camera,
  Plus,
  X,
  MapPin,
  Calendar,
  User,
  Edit3,
  CheckCircle,
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
import KeyboardAvoidingAnimatedView from "../../components/KeyboardAvoidingAnimatedView";

const { width } = Dimensions.get("window");

export default function ProfileCreationScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    displayName: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    interests: [],
    photos: [],
    height: "",
    education: "",
    career: "",
    city: "",
  });

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const interests = [
    "Travel",
    "Photography",
    "Music",
    "Movies",
    "Books",
    "Art",
    "Cooking",
    "Fitness",
    "Yoga",
    "Dancing",
    "Gaming",
    "Sports",
    "Nature",
    "Hiking",
    "Coffee",
    "Wine",
    "Fashion",
    "Technology",
    "Spirituality",
    "Meditation",
    "Volunteering",
    "Animals",
  ];

  const genders = [
    { id: "woman", label: "Woman", emoji: "👩" },
    { id: "man", label: "Man", emoji: "👨" },
    { id: "non-binary", label: "Non-binary", emoji: "🧑" },
    { id: "other", label: "Other", emoji: "✨" },
  ];

  const toggleInterest = (interest) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const selectGender = (gender) => {
    setProfileData((prev) => ({ ...prev, gender }));
  };

  const addPhoto = () => {
    // In a real app, this would open image picker
    Alert.alert(
      "Add Photo",
      "Photo picker will be available in the next update!",
      [{ text: "OK" }],
    );
  };

  const removePhoto = (index) => {
    setProfileData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateProfile = () => {
    if (!profileData.displayName.trim()) {
      Alert.alert("Missing Info", "Please enter your name");
      return false;
    }
    if (!profileData.dateOfBirth) {
      Alert.alert("Missing Info", "Please enter your date of birth");
      return false;
    }
    if (!profileData.gender) {
      Alert.alert("Missing Info", "Please select your gender");
      return false;
    }
    if (!profileData.bio.trim()) {
      Alert.alert("Missing Info", "Please write a short bio about yourself");
      return false;
    }
    if (profileData.interests.length < 3) {
      Alert.alert("Missing Info", "Please select at least 3 interests");
      return false;
    }
    return true;
  };

  const handleCreateProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/profiles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: auth?.uid,
          ...profileData,
        }),
      });

      if (response.ok) {
        router.replace("/(tabs)/discover");
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      Alert.alert("Error", "Failed to create your profile. Please try again.");
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

  const completionPercentage = Math.round(
    (Object.values(profileData).filter((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value),
    ).length /
      Object.keys(profileData).length) *
      100,
  );

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
              onPress={() => router.back()}
              style={{ padding: 8 }}
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
              Create Profile
            </Text>

            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 14,
                color: colors.primary,
              }}
            >
              {completionPercentage}%
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
                width: `${completionPercentage}%`,
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Photos Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.text,
                marginBottom: 16,
              }}
            >
              Add Photos
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* Add Photo Button */}
                <TouchableOpacity
                  onPress={addPhoto}
                  style={{
                    width: 100,
                    height: 140,
                    borderRadius: 16,
                    backgroundColor: colors.surfaceElevated,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: "dashed",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Camera size={24} color={colors.textSecondary} />
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Add Photo
                  </Text>
                </TouchableOpacity>

                {/* Photo Placeholders */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 100,
                      height: 140,
                      borderRadius: 16,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: colors.textTertiary,
                      }}
                    >
                      Photo {index + 2}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
                lineHeight: 16,
              }}
            >
              Add 2-6 photos that show your personality. First photo will be
              your main profile picture.
            </Text>
          </View>

          {/* Basic Info Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.text,
                marginBottom: 16,
              }}
            >
              Basic Information
            </Text>

            {/* Display Name */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                First Name *
              </Text>
              <TextInput
                value={profileData.displayName}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, displayName: text }))
                }
                placeholder="Enter your first name"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.text,
                }}
              />
            </View>

            {/* Date of Birth */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Date of Birth *
              </Text>
              <TextInput
                value={profileData.dateOfBirth}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, dateOfBirth: text }))
                }
                placeholder="MM/DD/YYYY"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.text,
                }}
              />
            </View>

            {/* Gender */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Gender *
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {genders.map((gender) => (
                  <TouchableOpacity
                    key={gender.id}
                    onPress={() => selectGender(gender.id)}
                    style={{
                      backgroundColor:
                        profileData.gender === gender.id
                          ? colors.primary
                          : colors.surface,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor:
                        profileData.gender === gender.id
                          ? colors.primary
                          : colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16, marginRight: 8 }}>
                      {gender.emoji}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 14,
                        color:
                          profileData.gender === gender.id
                            ? "#FFFFFF"
                            : colors.text,
                      }}
                    >
                      {gender.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.text,
                marginBottom: 16,
              }}
            >
              About You
            </Text>

            <TextInput
              value={profileData.bio}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, bio: text }))
              }
              placeholder="Write a short bio about yourself..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              maxLength={500}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: colors.border,
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: colors.text,
                textAlignVertical: "top",
                minHeight: 100,
              }}
            />
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textTertiary,
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {profileData.bio.length}/500
            </Text>
          </View>

          {/* Interests Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.text,
                marginBottom: 8,
              }}
            >
              Your Interests
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 16,
              }}
            >
              Select at least 3 things you're passionate about
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {interests.map((interest) => {
                const isSelected = profileData.interests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={{
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.surface,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: 14,
                        color: isSelected ? "#FFFFFF" : colors.text,
                      }}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Additional Info */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: colors.text,
                marginBottom: 16,
              }}
            >
              Additional Details (Optional)
            </Text>

            <View style={{ gap: 16 }}>
              <TextInput
                value={profileData.city}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, city: text }))
                }
                placeholder="City"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.text,
                }}
              />

              <TextInput
                value={profileData.career}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, career: text }))
                }
                placeholder="Job Title"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.text,
                }}
              />

              <TextInput
                value={profileData.education}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, education: text }))
                }
                placeholder="Education"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: colors.text,
                }}
              />
            </View>
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
            onPress={handleCreateProfile}
            disabled={loading || completionPercentage < 70}
            style={{
              backgroundColor:
                completionPercentage >= 70
                  ? colors.primary
                  : colors.textTertiary,
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
              {loading ? "Creating Profile..." : "Complete Profile"}
            </Text>
            {!loading && <CheckCircle size={20} color="#FFFFFF" />}
          </TouchableOpacity>

          {completionPercentage < 70 && (
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textTertiary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Complete at least 70% to continue
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
