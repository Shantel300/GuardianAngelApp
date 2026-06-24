import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

type Props = {
  message: string;
  isUser: boolean;
};

export default function ChatBubble({ message, isUser }: Props) {
  return (
    <View
      style={[
        styles.container,
        isUser && styles.userContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser && styles.userBubble,
          !isUser && styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser && styles.userText,
            !isUser && styles.assistantText,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.lg,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: THEME.colors.primary,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME.colors.outline,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: THEME.colors.onPrimary,
  },
  assistantText: {
    color: THEME.colors.onSurface,
  },
});
