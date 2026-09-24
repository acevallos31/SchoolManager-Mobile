import { View, Text, StyleSheet } from 'react-native';

import { useAppSelector } from '../store/hooks';
import { getThemeColors } from '../store/slices/themeSlice';

type Props = {
  title: string;
  value: string;
};

export default function InfoCard({ title, value }: Props) {
  const isDark = useAppSelector(
    (state) => state.theme.isDark
  );

  const colors = getThemeColors(isDark);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Text
        style={[
          styles.value,
          { color: colors.primary },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.title,
          { color: colors.textSecondary },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    margin: 5,
  },

  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 14,
    marginTop: 5,
  },
});