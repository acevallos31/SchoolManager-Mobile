import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: Props) {

  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'tertiary':
        return styles.tertiaryButton;
      default:
        return styles.primaryButton;
    }
  };

  return (
    <Pressable
      style={[styles.button, getStyles(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 9,
    alignItems: 'center',
    marginVertical: 8,
  },

  primaryButton: {
    backgroundColor: '#1E3A8A',
  },

  secondaryButton: {
    backgroundColor: '#2563EB',
  },

  tertiaryButton: {
    backgroundColor: '#64748B',
  },

  disabledButton: {
    backgroundColor: '#B0B0B0',
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});