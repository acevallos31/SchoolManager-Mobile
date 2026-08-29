import { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  TouchableOpacity,
  Text,
} from 'react-native';

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'default' | 'password' | 'number' | 'email';
};

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  type = 'default',
}: Props) {
  const [isSecureText, setIsSecureText] = useState(true);

  const isPasswordField = type === 'password';

  const getKeyboardType = (): KeyboardTypeOptions => {
    if (type === 'email') {
      return 'email-address';
    }

    if (type === 'number') {
      return 'numeric';
    }

    return 'default';
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={getKeyboardType()}
          secureTextEntry={isPasswordField && isSecureText}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
          >
            <Text style={styles.showText}>
              {isSecureText ? 'Mostrar' : 'Ocultar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 9,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },

  showText: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});