import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    return email.includes('@') && email.endsWith('.edu');
  };

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        'Error',
        'El correo electrónico debe tener extensión .edu'
      );
      return;
    }

    if (password.length < 4) {
      Alert.alert(
        'Error',
        'La contraseña debe tener al menos 4 caracteres'
      );
      return;
    }

    navigation.navigate('MainTabs', { email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SchoolManager</Text>

      <Text style={styles.subtitle}>Iniciar sesión</Text>

      <CustomInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        type="email"
      />

      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        type="password"
      />

      <CustomButton
        title="Ingresar"
        onPress={handleLogin}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 30,
  },
});