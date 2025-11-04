import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "../utils/theme";
import { Star, ExternalLink } from "lucide-react-native";

// Native Advanced Ad Component
// This creates a native ad that matches the app's look and feel
export default function AdNative({
  adUnitId = Platform.OS === "ios"
    ? "ca-app-pub-9186407493474085/7216767460"
    : "ca-app-pub-9186407493474085/7216767460",
  style = {},
  onAdLoaded = () => {},
  onAdFailedToLoad = () => {},
  onAdClicked = () => {},
  testMode = true,
}) {
  const { colors, isDark } = useTheme();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(null);
  const [adData, setAdData] = useState(null);
  const isDev = Constants.appOwnership === "expo" || !Constants.isDevice;

  useEffect(() => {
    initializeNativeAd();
  }, []);

  const initializeNativeAd = async () => {
    try {
      // In development/test mode, show realistic placeholder
      if (isDev || testMode) {
        // Simulate loading delay
        setTimeout(() => {
          setAdData({
            headline: "Find Your Perfect Match Today",
            body: "Join millions of singles finding meaningful connections. Download the top-rated dating app now!",
            advertiser: "LoveConnect",
            callToAction: "Install Now",
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=300&h=200&fit=crop",
            icon: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
          });
          setAdLoaded(true);
          onAdLoaded();
        }, 1000);
        return;
      }

      // Production AdMob native ad integration would go here
      // This requires expo-dev-client and google-mobile-ads
      // const nativeAd = await admob.createNativeAd({
      //   adUnitId: testMode ? 'ca-app-pub-3940256099942544/2247696110' : adUnitId,
      //   requestOptions: {
      //     requestNonPersonalizedAdsOnly: false,
      //   },
      // });

      // nativeAd.onAdLoaded((ad) => {
      //   setAdData(ad);
      //   setAdLoaded(true);
      //   onAdLoaded();
      // });

      // nativeAd.onAdFailedToLoad((error) => {
      //   setAdError(error);
      //   onAdFailedToLoad(error);
      // });

      // nativeAd.onAdClicked(() => {
      //   onAdClicked();
      // });

      // nativeAd.load();
    } catch (error) {
      console.error("AdMob Native Ad Error:", error);
      setAdError(error);
      onAdFailedToLoad(error);
    }
  };

  const handleAdClick = () => {
    console.log("Native ad clicked");
    onAdClicked();
  };

  // Loading state
  if (!adLoaded && !adError) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: 16,
            padding: 16,
            margin: 16,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: colors.background,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 16,
                backgroundColor: colors.background,
                borderRadius: 4,
                marginBottom: 6,
              }}
            />
            <View
              style={{
                height: 12,
                backgroundColor: colors.background,
                borderRadius: 4,
                width: "60%",
              }}
            />
          </View>
        </View>

        <View
          style={{
            height: 120,
            backgroundColor: colors.background,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <View
          style={{
            height: 40,
            backgroundColor: colors.background,
            borderRadius: 8,
          }}
        />

        <Text
          style={{
            fontSize: 10,
            color: colors.textTertiary,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Loading ad...
        </Text>
      </View>
    );
  }

  // Error state
  if (adError) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.errorBackground,
            borderRadius: 16,
            padding: 16,
            margin: 16,
            alignItems: "center",
          },
          style,
        ]}
      >
        <Text
          style={{
            color: colors.error,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Ad failed to load
        </Text>
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {adError.message || "Unknown error"}
        </Text>
      </View>
    );
  }

  // Success state with ad content
  if (adLoaded && adData) {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: 16,
            padding: 16,
            margin: 16,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          },
          style,
        ]}
        onPress={handleAdClick}
        activeOpacity={0.8}
      >
        {/* Ad Label */}
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: colors.warning,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            Ad
          </Text>
        </View>

        {/* Header with icon and info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            source={{ uri: adData.icon }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              marginRight: 12,
            }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 2,
              }}
            >
              {adData.headline}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginRight: 8,
                }}
              >
                {adData.advertiser}
              </Text>
              {adData.rating && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Star
                    size={12}
                    color={colors.warning}
                    fill={colors.warning}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginLeft: 2,
                    }}
                  >
                    {adData.rating}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Main image */}
        <Image
          source={{ uri: adData.image }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginBottom: 12,
          }}
          resizeMode="cover"
        />

        {/* Body text */}
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            marginBottom: 16,
          }}
        >
          {adData.body}
        </Text>

        {/* Call to action button */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            {adData.callToAction || "Learn More"}
          </Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </View>

        {/* Test mode indicator */}
        {(isDev || testMode) && (
          <Text
            style={{
              fontSize: 10,
              color: colors.textTertiary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            📱 Native Ad • {testMode ? "Test Mode" : "Development"}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return null;
}
