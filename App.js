import React from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppDataProvider } from "./src/contexts/AppDataContext";
import { AuthProvider } from "./src/contexts/AuthContext";
import LoadingOverlay from "./src/components/LoadingOverlay";
import { useAuth } from "./src/hooks/useAuth";
import AppNavigation from "./src/navigation";

const Root = () => {
  const { loading } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <AppNavigation />
      <LoadingOverlay visible={loading} />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <StatusBar style="dark" />
        <Root />
      </AppDataProvider>
    </AuthProvider>
  );
}
