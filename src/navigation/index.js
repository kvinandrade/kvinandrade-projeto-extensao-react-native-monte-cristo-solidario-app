import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import AlimentosScreen from "../screens/Alimentos";
import CadastroFamiliaScreen from "../screens/CadastroFamilia";
import ConfiguracoesScreen from "../screens/Configuracoes";
import DashboardScreen from "../screens/Dashboard";
import GestaoAdminsScreen from "../screens/GestaoAdmins";
import LoginScreen from "../screens/Login";
import RelatoriosScreen from "../screens/Relatorios";
import RetiradaScreen from "../screens/Retirada";
import { theme } from "../theme";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: "#f8fcfd",
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontWeight: "700",
  },
};

const AppNavigation = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={screenOptions}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Retirada" component={RetiradaScreen} />
          <Stack.Screen name="CadastroFamilia" component={CadastroFamiliaScreen} options={{ title: "Cadastro de Famílias" }} />
          <Stack.Screen name="Alimentos" component={AlimentosScreen} options={{ title: "Controle de Alimentos" }} />
          <Stack.Screen name="Relatorios" component={RelatoriosScreen} options={{ title: "Relatórios" }} />
          <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ title: "Configurações" }} />
          <Stack.Screen name="GestaoAdmins" component={GestaoAdminsScreen} options={{ title: "Gestão de Admins" }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
