import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import { ActivityIndicator, View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text }}>Validando sesión…</Text>
    </View>
  );
  return (
    <Stack.Navigator>
      {!user ? <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      /> : <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />}
    </Stack.Navigator>
  );
}
