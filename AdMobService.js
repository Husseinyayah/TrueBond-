import Constants from "expo-constants";
import { Platform } from "react-native";

// AdMob Configuration and Service
class AdMobService {
  constructor() {
    this.isTestMode = true; // Enable for testing
    this.isInitialized = false;
    this.appId = "ca-app-pub-9186407493474085~6780819047";

    // Ad Unit IDs
    this.adUnits = {
      banner:
        Platform.OS === "ios"
          ? "ca-app-pub-9186407493474085/2421624792"
          : "ca-app-pub-9186407493474085/2421624792",
      nativeAdvanced:
        Platform.OS === "ios"
          ? "ca-app-pub-9186407493474085/7216767460"
          : "ca-app-pub-9186407493474085/7216767460",
      // Test ad unit IDs for development
      testBanner:
        Platform.OS === "ios"
          ? "ca-app-pub-3940256099942544/2934735716"
          : "ca-app-pub-3940256099942544/6300978111",
      testNative:
        Platform.OS === "ios"
          ? "ca-app-pub-3940256099942544/3986624511"
          : "ca-app-pub-3940256099942544/2247696110",
    };
  }

  // Initialize AdMob
  async initialize() {
    try {
      const isDev = Constants.appOwnership === "expo" || !Constants.isDevice;

      console.log("🚀 Initializing AdMob Service...");
      console.log("📱 Platform:", Platform.OS);
      console.log("🧪 Test Mode:", this.isTestMode);
      console.log("💻 Development Mode:", isDev);
      console.log("🆔 App ID:", this.appId);

      if (isDev || this.isTestMode) {
        // In development/test mode, just mark as initialized
        this.isInitialized = true;
        console.log("✅ AdMob Service initialized (Development Mode)");
        return true;
      }

      // Production initialization would go here
      // This requires expo-dev-client and react-native-google-mobile-ads
      //
      // import mobileAds from 'react-native-google-mobile-ads';
      //
      // await mobileAds().initialize();
      //
      // if (this.isTestMode) {
      //   await mobileAds().setRequestConfiguration({
      //     testDeviceIds: ['EMULATOR'],
      //   });
      // }

      this.isInitialized = true;
      console.log("✅ AdMob Service initialized (Production Mode)");
      return true;
    } catch (error) {
      console.error("❌ AdMob initialization failed:", error);
      return false;
    }
  }

  // Get the appropriate ad unit ID
  getAdUnitId(adType) {
    if (this.isTestMode || Constants.appOwnership === "expo") {
      return this.adUnits[
        `test${adType.charAt(0).toUpperCase() + adType.slice(1)}`
      ];
    }
    return this.adUnits[adType];
  }

  // Check if AdMob is ready
  isReady() {
    return this.isInitialized;
  }

  // Enable/disable test mode
  setTestMode(enabled) {
    this.isTestMode = enabled;
    console.log(`🧪 AdMob Test Mode: ${enabled ? "Enabled" : "Disabled"}`);
  }

  // Get configuration info
  getConfig() {
    return {
      appId: this.appId,
      isTestMode: this.isTestMode,
      isInitialized: this.isInitialized,
      platform: Platform.OS,
      adUnits: this.adUnits,
      isDevelopment: Constants.appOwnership === "expo" || !Constants.isDevice,
    };
  }

  // Analytics helper
  logAdEvent(eventName, adType, adUnitId) {
    console.log(`📊 AdMob Event: ${eventName}`, {
      adType,
      adUnitId,
      platform: Platform.OS,
      testMode: this.isTestMode,
    });

    // Here you could send to your analytics service
    // analytics.logEvent('admob_' + eventName, {
    //   ad_type: adType,
    //   ad_unit_id: adUnitId,
    //   platform: Platform.OS
    // });
  }
}

// Create singleton instance
const admobService = new AdMobService();

export default admobService;
