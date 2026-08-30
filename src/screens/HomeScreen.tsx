import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import InfoCard from '../components/InfoCard';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/SchoolManager-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        SchoolManager
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Panel principal
      </Text>

      <View style={styles.row}>
        <InfoCard
          title="Alumnos"
          value="125"
        />

        <InfoCard
          title="Matrículas"
          value="18"
        />
      </View>

      <View style={styles.row}>
        <InfoCard
          title="Mensualidades"
          value="42"
        />

        <InfoCard
          title="Pagos"
          value="35"
        />
      </View>

      <View
        style={[
          styles.schoolCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.schoolTitle,
            { color: colors.text },
          ]}
        >
          Centro educativo
        </Text>

        <Text
          style={[
            styles.schoolName,
            { color: colors.primary },
          ]}
        >
          Noan's Garden
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  logo: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
  },

  schoolCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },

  schoolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  schoolName: {
    fontSize: 20,
    marginTop: 5,
  },
});