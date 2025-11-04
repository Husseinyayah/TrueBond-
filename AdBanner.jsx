import React, { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "../utils/theme";

// AdMob Banner Component
// Note: This requires expo-dev-client and custom development build
export default function AdBanner({
  adUnitId = Platform.OS === "ios"
    ? "ca-app-pub-9186407493474085/2421624792"
    : "ca-app-pub-9186407493474085/2421624792",
  size = "banner", // banner, largeBanner, mediumRectangle
  style = {},
  onAdLoaded = () => {},
  onAdFailedToLoad = () => {},
  testMode = true,
}) {
  const { colors } = useTheme();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(null);
  const isDev = Constants.appOwnership === "expo" || !Constants.isDevice;

  useEffect(() => {
    // Initialize AdMob banner
    initializeBanner();
  }, []);

  const initializeBanner = async () => {
    try {
      // In development mode, show placeholder
      if (isDev || testMode) {
        setAdLoaded(true);
        onAdLoaded();
        return;
      }

      // Production AdMob integration would go here
      // This requires expo-dev-client and google-mobile-ads
      // const banner = await admob.createBannerAd({
      //   adUnitId: testMode ? 'ca-app-pub-3940256099942544/6300978111' : adUnitId,
      //   size: size,
      //   requestOptions: {
      //     requestNonPersonalizedAdsOnly: false,
      //   },
      // });

      // banner.onAdLoaded(() => {
      //   setAdLoaded(true);
      //   onAdLoaded();
      // });

      // banner.onAdFailedToLoad((error) => {
      //   setAdError(error);
      //   onAdFailedToLoad(error);
      // });

      // banner.show();
    } catch (error) {
      console.error("AdMob Banner Error:", error);
      setAdError(error);
      onAdFailedToLoad(error);
    }
  };

  // Development/Testing placeholder
  if (isDev || testMode) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.surfaceElevated,
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: "dashed",
            borderRadius: 8,
            padding: 12,
            alignItems: "center",
            justifyContent: "center",
            minHeight:
              size === "banner" ? 50 : size === "largeBanner" ? 100 : 250,
          },
          style,
        ]}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: "500",
          }}
        >
          📱 AdMob Banner Ad
        </Text>
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 10,
            marginTop: 4,
          }}
        >
          {testMode ? "Test Mode" : "Development"} • {size}
        </Text>
        <Text
          style={{
            color: colors.textTertiary,
            fontSize: 8,
            marginTop: 2,
          }}
        >
          ID: {adUnitId}
        </Text>
      </View>
    );
  }

  // Production error state
  if (adError) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.errorBackground,
            borderRadius: 8,
            padding: 8,
            alignItems: "center",
          },
          style,
        ]}
      >
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
          }}
        >
          Ad failed to load
        </Text>
      </View>
    );
  }

  // Loading state
  if (!adLoaded) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: 8,
            padding: 20,
            alignItems: "center",
            minHeight: 50,
            justifyContent: "center",
          },
          style,
        ]}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 12,
          }}
        >
          Loading ad...
        </Text>
      </View>
    );
  }

  // Production ad container
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 8,
          overflow: "hidden",
          alignItems: "center",
        },
        style,
      ]}
    >
      {/* AdMob banner will render here in production */}
    </View>
  );
}
