import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ChatBubble from '../../components/ChatBubble';
import PrivacyBanner from '../../components/PrivacyBanner';
import Mascot from '../../components/Mascot';
import { classifyMessage } from '../../services/classifierApi';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';

type Message = { id: number; type: 'user' | 'assistant'; text: string };

const SUGGESTIONS = ['I feel pressured', 'I feel stressed', "I'm having cravings", 'I need support'];

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { id: prev.length + 1, type: 'user', text: trimmed }]);
    setMessage('');
    setIsLoading(true);

    try {
      const result = await classifyMessage(trimmed);
      setIsLoading(false);
      router.push({
        pathname: '/assessment',
        params: { result: JSON.stringify(result), userMessage: trimmed },
      });
    } catch {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, type: 'assistant', text: 'Sorry, I had trouble with that. Please try again.' },
      ]);
    }
  };

  const endSession = () => {
    Alert.alert(
      'End private session?',
      'All messages will be permanently deleted. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete & End',
          style: 'destructive',
          onPress: () => {
            setMessages([{ id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }]);
            Alert.alert('Session ended', 'All messages have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Mascot size={40} />
          <View>
            <Text style={styles.title}>Talk Privately</Text>
            <Text style={styles.subtitle}>Guardian is listening</Text>
          </View>
        </View>
        <Pressable style={styles.endBtn} onPress={endSession}>
          <MaterialIcons name="lock-clock" size={15} color={COLORS.primary} />
          <Text style={styles.endText}>End</Text>
        </Pressable>
      </View>

      <PrivacyBanner />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m.text} isUser={m.type === 'user'} />
          ))}
          {isLoading && (
            <View style={styles.typing}>
              <ActivityIndicator size="small" color={COLORS.secondary} />
              <Text style={styles.typingText}>Guardian is thinking…</Text>
            </View>
          )}
        </ScrollView>

        {messages.length <= 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}
          >
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.chip} onPress={() => send(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Composer */}
        <View style={styles.composer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message…"
              placeholderTextColor={COLORS.outline}
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!isLoading}
              onSubmitEditing={() => send(message)}
            />
            <Pressable
              onPress={() => send(message)}
              disabled={!message.trim() || isLoading}
              style={[styles.sendBtn, (!message.trim() || isLoading) && styles.sendBtnDisabled]}
            >
              <MaterialIcons name="arrow-upward" size={22} color={COLORS.onPrimary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.page,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { ...TYPE.headlineMd, color: COLORS.onSurface },
  subtitle: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryTint,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: RADIUS.full,
  },
  endText: { ...TYPE.labelMd, color: COLORS.primary },

  messages: { paddingHorizontal: SPACING.page, paddingTop: 8, paddingBottom: 12 },
  typing: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  typingText: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant },

  suggestions: { paddingHorizontal: SPACING.page, paddingVertical: 10, gap: 8 },
  chip: {
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: 'rgba(226,190,188,0.5)',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
  },
  chipText: { ...TYPE.labelMd, color: COLORS.onSurfaceVariant },

  composer: {
    paddingHorizontal: SPACING.page,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226,190,188,0.3)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surfaceLowest,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(226,190,188,0.5)',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: { flex: 1, ...TYPE.bodyMd, color: COLORS.onSurface, maxHeight: 100, paddingVertical: 8 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.surfaceHigh },
});
