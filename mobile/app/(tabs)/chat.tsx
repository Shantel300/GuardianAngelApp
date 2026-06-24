import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import ChatBubble from '../../components/ChatBubble';
import PrivacyBanner from '../../components/PrivacyBanner';
import { classifyMessage } from '../../services/classifierApi';
import { THEME } from '../../constants/theme';

type Message = {
  id: number;
  type: 'user' | 'assistant';
  text: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionActive) return;

    const userMessage = message.trim();
    const newMessageId = messages.length + 1;

    // Add user message to state
    setMessages(prev => [
      ...prev,
      { id: newMessageId, type: 'user', text: userMessage }
    ]);
    setMessage('');
    setIsLoading(true);

    try {
      // Call classifier (mock or real API)
      const result = await classifyMessage(userMessage);

      // Add assistant thinking message
      const assistantId = newMessageId + 1;
      setMessages(prev => [
        ...prev,
        { id: assistantId, type: 'assistant', text: 'I\'ve analyzed your message. Let me show you what I found.' }
      ]);

      // Store result for the assessment screen
      setIsLoading(false);

      // Navigate to assessment screen with result
      router.push({
        pathname: '/assessment',
        params: {
          result: JSON.stringify(result),
          userMessage: userMessage,
        }
      });
    } catch (error) {
      console.error('Classification error:', error);
      setIsLoading(false);
      const errorId = messages.length + 1;
      setMessages(prev => [
        ...prev,
        { id: errorId, type: 'assistant', text: 'Sorry, I had trouble analyzing that. Please try again.' }
      ]);
    }
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Private Session?',
      'All messages will be permanently deleted. This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete & End',
          onPress: () => {
            // Clear all messages from memory
            setMessages([
              { id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }
            ]);
            setSessionActive(false);
            Alert.alert('Session Ended', 'All messages have been cleared.');
            setSessionActive(true);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const suggestedPrompts = [
    'I feel pressured',
    'I feel stressed',
    'I\'m experiencing cravings',
    'I need support'
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e3e6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#191c1e' }}>
            Talk Privately
          </Text>
          <Text style={{ fontSize: 12, color: '#5a403f', marginTop: 4 }}>
            Guardian Angel Chat
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleEndSession}
          style={{
            backgroundColor: '#fff3f3',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#ffb3b0'
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#b52330' }}>
            End Session
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Banner */}
      <PrivacyBanner message="🔒 This session will not be saved" />

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.type === 'user'} />
        ))}

        {isLoading && (
          <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{
              backgroundColor: '#fff',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#e0e3e6',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <ActivityIndicator size="small" color="#0060ac" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#5a403f' }}>Analyzing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <ScrollView
          horizontal
          style={{ paddingHorizontal: 20, paddingVertical: 12, maxHeight: 60 }}
          showsHorizontalScrollIndicator={false}
        >
          {suggestedPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setMessage(prompt);
              }}
              style={{
                backgroundColor: '#fff',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#e0e3e6'
              }}
            >
              <Text style={{ fontSize: 12, color: '#5a403f', fontWeight: '500' }}>
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input Area */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e3e6',
        backgroundColor: '#f7f9fc'
      }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 4,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <TextInput
            style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: '#191c1e' }}
            placeholder="Type your message..."
            placeholderTextColor="#8e706f"
            value={message}
            onChangeText={setMessage}
            multiline
            maxHeight={100}
            editable={!isLoading}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!message.trim() || isLoading}
            style={{
              marginLeft: 8,
              opacity: !message.trim() || isLoading ? 0.5 : 1
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0060ac" />
            ) : (
              <Text style={{ fontSize: 20, color: '#ff5a5f', fontWeight: '700' }}>
                →
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
