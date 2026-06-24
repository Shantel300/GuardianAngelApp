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
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ChatBubble from '../../components/ChatBubble';
import PrivacyBanner from '../../components/PrivacyBanner';
import Mascot from '../../components/Mascot';
import RiskBadge from '../../components/RiskBadge';
import {
  ChatMessage,
  ReplySource,
  SourcedClassificationResult,
  healthCheck,
  sendChatMessage,
} from '../../services/classifierApi';
import { COLORS, TYPE, SPACING, RADIUS } from '../../constants/theme';
import { useGuardian } from '../../context/GuardianContext';

type ApiStatus = 'checking' | 'ready' | 'fallback';

const SUGGESTIONS = ['I feel pressured', 'I feel stressed', "I'm having cravings", 'I need support'];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    consent,
    chatMessages: messages,
    addChatMessage,
    clearChat,
  } = useGuardian();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [assessment, setAssessment] =
    useState<SourcedClassificationResult | null>(null);
  const [replySource, setReplySource] = useState<ReplySource | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const checkConnection = async () => {
    setApiStatus('checking');
    const ready = await healthCheck();
    setApiStatus(ready ? 'ready' : 'fallback');
  };

  useEffect(() => {
    void checkConnection();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages]);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (messages.length === 1) {
      setAssessment(null);
      setReplySource(null);
    }
  }, [messages.length]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !consent.chatbot) return;

    addChatMessage('user', trimmed);
    setMessage('');
    setIsLoading(true);

    try {
      const context: ChatMessage[] = [
        ...messages.map<ChatMessage>((item) => ({
          role: item.type,
          content: item.text,
        })),
        { role: 'user' as const, content: trimmed },
      ].slice(-4);
      const result = await sendChatMessage(
        context,
        apiStatus === 'ready'
      );
      addChatMessage('assistant', result.reply);
      setAssessment(result.assessment);
      setReplySource(result.replySource);
      if (result.replySource === 'mock') setApiStatus('fallback');
    } catch {
      addChatMessage('assistant', 'Sorry, I had trouble with that. Please try again.');
    } finally {
      setIsLoading(false);
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
            clearChat();
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

      <PrivacyBanner message="Only four recent messages are processed; they are not saved" />

      <View
        style={[
          styles.connection,
          apiStatus === 'ready' ? styles.connectionReady : styles.connectionFallback,
        ]}
      >
        <MaterialIcons
          name={apiStatus === 'ready' ? 'verified-user' : 'info-outline'}
          size={16}
          color={apiStatus === 'ready' ? COLORS.tertiary : COLORS.warning}
        />
        <Text style={styles.connectionText}>
          {apiStatus === 'checking'
            ? 'Checking the private AI service...'
            : apiStatus === 'ready'
              ? 'Local trained AI connected'
              : 'Demo fallback classifier active'}
        </Text>
        {apiStatus === 'fallback' && (
          <Pressable onPress={() => void checkConnection()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
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
          {assessment && !isLoading && (
            <View style={styles.assessmentSummary}>
              <View style={styles.assessmentRow}>
                <RiskBadge level={assessment.riskLevel} />
                <Text style={styles.sourceText}>
                  {replySource === 'llm'
                    ? 'Generated locally'
                    : replySource === 'template'
                      ? 'Reviewed safety reply'
                      : 'Demo fallback reply'}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/assessment',
                    params: { result: JSON.stringify(assessment) },
                  })
                }
              >
                <Text style={styles.assessmentLink}>Why am I seeing this?</Text>
              </Pressable>
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

        {!consent.chatbot && (
          <View style={styles.disabledNotice}>
            <MaterialIcons name="lock" size={17} color={COLORS.primary} />
            <Text style={styles.disabledNoticeText}>
              Private Chatbot consent is disabled.
            </Text>
            <Pressable onPress={() => router.push('/settings/privacy')}>
              <Text style={styles.retryText}>Review</Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.composer, { paddingBottom: Math.max(10, insets.bottom) }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message…"
              placeholderTextColor={COLORS.outline}
              selectionColor={COLORS.primaryContainer}
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!isLoading && consent.chatbot}
              textAlignVertical="top"
              blurOnSubmit={false}
              accessibilityLabel="Private message"
              onSubmitEditing={() => send(message)}
            />
            <Pressable
              onPress={() => send(message)}
              disabled={!message.trim() || isLoading || !consent.chatbot}
              style={[styles.sendBtn, (!message.trim() || isLoading || !consent.chatbot) && styles.sendBtnDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Send message"
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
  keyboardArea: { flex: 1 },
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
  connection: {
    marginHorizontal: SPACING.page,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionReady: { backgroundColor: COLORS.tertiaryTint },
  connectionFallback: { backgroundColor: COLORS.warningTint },
  connectionText: {
    ...TYPE.labelSm,
    color: COLORS.onSurfaceVariant,
    flex: 1,
  },
  retryText: { ...TYPE.labelSm, color: COLORS.secondary },
  disabledNotice: {
    marginHorizontal: SPACING.page,
    marginBottom: 4,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryTint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledNoticeText: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant, flex: 1 },
  assessmentSummary: {
    backgroundColor: COLORS.surfaceLowest,
    borderWidth: 1,
    borderColor: 'rgba(226,190,188,0.5)',
    borderRadius: RADIUS.lg,
    padding: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sourceText: { ...TYPE.labelSm, color: COLORS.onSurfaceVariant },
  assessmentLink: {
    ...TYPE.labelMd,
    color: COLORS.secondary,
    marginTop: 10,
  },

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
  input: {
    flex: 1,
    ...TYPE.bodyMd,
    color: COLORS.onSurface,
    backgroundColor: COLORS.surfaceLowest,
    minHeight: 40,
    maxHeight: 112,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.surfaceHigh },
});
