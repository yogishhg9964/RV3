import 'dotenv/config';

export default {
  expo: {
    name: "rv-visitor-management",
    slug: "rv-visitor-management",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rv-visitor-management",
      permissions: [
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY ?? null,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN ?? null,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? null,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? null,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? null,
      firebaseAppId: process.env.FIREBASE_APP_ID ?? null,
      eas: {
        projectId: "81eb7105-b7bb-43d1-b4fc-b38c0e30413e"
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            buildToolsVersion: "33.0.0"
          }
        }
      ]
    ]
  }
}; 