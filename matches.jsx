import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MessageCircle,
  Heart,
  Star,
  Clock,
  Search,
  Filter,
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

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Sample matches data (replace with API call)
  useEffect(() => {
    const sampleMatches = [
      {
        match_id: "match1",
        profile: {
          uid: "user1",
          display_name: "Sarah",
          age: 24,
          photos: [
            "https://images.unsplash.com/photo-1494790108755-2616b612b2c5?w=400&h=600&fit=crop&crop=face",
          ],
          bio: "Adventure seeker, coffee enthusiast",
          location_city: "New York",
        },
        last_message: "Hey! Thanks for the super like! ✨",
        last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        unread_count: 2,
        match_type: "super", // super, regular
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        match_id: "match2",
        profile: {
          uid: "user2",
          display_name: "Emma",
          age: 26,
          photos: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
          ],
          bio: "Artist and yoga instructor",
          location_city: "Brooklyn",
        },
        last_message: "Looking forward to our coffee date!",
        last_message_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        unread_count: 0,
        match_type: "regular",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        match_id: "match3",
        profile: {
          uid: "user3",
          display_name: "Olivia",
          age: 23,
          photos: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
          ],
          bio: "Tech professional by day, chef by night",
          location_city: "Manhattan",
        },
        last_message: "Hi there! Love your profile 😊",
        last_message_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        unread_count: 1,
        match_type: "regular",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        match_id: "match4",
        profile: {
          uid: "user4",
          display_name: "Isabella",
          age: 25,
          photos: [
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face",
          ],
          bio: "Photographer and nature lover",
          location_city: "Queens",
        },
        last_message: null,
        last_message_at: null,
        unread_count: 0,
        match_type: "regular",
        created_at: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago (new match)
      },
    ];

    setMatches(sampleMatches);
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

  const formatTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const renderMatch = ({ item }) => {
    const isNewMatch = !item.last_message;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          padding: 16,
          backgroundColor: colors.surface,
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 16,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.border,
          position: "relative",
        }}
      >
        {/* Profile Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: item.profile.photos[0] }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              marginRight: 12,
            }}
            resizeMode="cover"
          />

          {/* Match Type Indicator */}
          {item.match_type === "super" && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: 8,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.info,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.surface,
              }}
            >
              <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}

          {/* Online Indicator */}
          <View
            style={{
              position: "absolute",
              bottom: 2,
              right: 8,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: colors.success,
              borderWidth: 2,
              borderColor: colors.surface,
            }}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: colors.text,
              }}
            >
              {item.profile.display_name}
            </Text>

            {item.last_message_at && (
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: colors.textTertiary,
                }}
              >
                {formatTime(item.last_message_at)}
              </Text>
            )}
          </View>

          {isNewMatch ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.accent + "20",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              <Sparkles size={12} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 12,
                  color: colors.accent,
                  marginLeft: 4,
                }}
              >
                New Match!
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color:
                  item.unread_count > 0 ? colors.text : colors.textSecondary,
                fontWeight: item.unread_count > 0 ? "500" : "400",
              }}
              numberOfLines={1}
            >
              {item.last_message}
            </Text>
          )}
        </View>

        {/* Unread Badge */}
        {item.unread_count > 0 && (
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 10,
                color: "#FFFFFF",
              }}
            >
              {item.unread_count > 9 ? "9+" : item.unread_count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
          Loading your matches...
        </Text>
      </View>
    );
  }

  const totalUnread = matches.reduce(
    (sum, match) => sum + match.unread_count,
    0,
  );
  const newMatches = matches.filter((match) => !match.last_message);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBar} />

      {/* Fixed Header */}
      <View
        style={{
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: isScrolled ? 1 : 0,
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
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 24,
              color: colors.text,
            }}
          >
            Matches
          </Text>

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
              <Search
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
              <Filter
                size={20}
                color={colors.textSecondary}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 20,
                color: colors.primary,
                marginBottom: 2,
              }}
            >
              {matches.length}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Total Matches
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 20,
                color: colors.accent,
                marginBottom: 2,
              }}
            >
              {newMatches.length}
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

          <View
            style={{
              flex: 1,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 20,
                color: colors.warning,
                marginBottom: 2,
              }}
            >
              {totalUnread}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Unread
            </Text>
          </View>
        </View>
      </View>

      {/* Matches List */}
      {matches.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.surfaceElevated,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Heart size={32} color={colors.textTertiary} />
          </View>

          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 18,
              color: colors.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            No matches yet
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
            Keep swiping to find amazing people who share your interests and
            values.
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.match_id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 20,
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
        />
      )}
    </View>
  );
}
