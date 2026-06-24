import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, TYPE } from '../constants/theme';

type Props = {
  message: string;
  isUser: boolean;
};

export default function ChatBubble({ message, isUser }: Props) {
  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        <Text style={[TYPE.bodyMd, isUser ? styles.userText : styles.assistantText]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12, alignItems: 'flex-start' },
  rowUser: { alignItems: 'flex-end' },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xl,
    maxWidth: '82%',
  },
  user: {
    backgroundColor: COLORS.primaryContainer,
    borderBottomRightRadius: RADIUS.sm,
  },
  assistant: {
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: 'rgba(226,190,188,0.4)',
    borderBottomLeftRadius: RADIUS.sm,
  },
  userText: { color: COLORS.onPrimary },
  assistantText: { color: COLORS.onSurface },
});
