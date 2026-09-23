import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider } from './src/contexts/ThemeContext';
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StackNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
