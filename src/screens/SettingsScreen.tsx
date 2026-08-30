import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Configuración
      </Text>

      <View
        style={[
          styles.optionContainer,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.optionInfo}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={26}
            color={colors.primary}
          />

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.optionTitle,
                { color: colors.text },
              ]}
            >
              Tema oscuro
            </Text>

            <Text
              style={[
                styles.optionDescription,
                { color: colors.textSecondary },
              ]}
            >
              Cambiar apariencia de la aplicación
            </Text>
          </View>
        </View>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
  },

  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  textContainer: {
    marginLeft: 15,
    flex: 1,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  optionDescription: {
    fontSize: 14,
    marginTop: 3,
  },
});