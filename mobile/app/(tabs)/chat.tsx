import { View, Text, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, type: 'user', text: message }]);
      setMessage('');
      // TODO: Call classifier API
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f9fc' }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#e0e3e6' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#191c1e' }}>
          Talk Privately
        </Text>
      </View>

      {/* Privacy Banner */}
      <View style={{
        backgroundColor: '#e3f2fd',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#0060ac'
      }}>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#003e73' }}>
          🔒 This session will not be saved
        </Text>
      </View>

      {/* Chat Messages */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={{ marginBottom: 12, alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
            <View style={{
              backgroundColor: msg.type === 'user' ? '#ff5a5f' : '#fff',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 16,
              maxWidth: '80%',
              borderWidth: msg.type === 'user' ? 0 : 1,
              borderColor: '#e0e3e6'
            }}>
              <Text style={{
                fontSize: 14,
                color: msg.type === 'user' ? '#fff' : '#191c1e'
              }}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Suggested Prompts */}
      <ScrollView horizontal style={{ paddingHorizontal: 20, paddingVertical: 12 }} showsHorizontalScrollIndicator={false}>
        <View style={{
          backgroundColor: '#fff',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 20,
          marginRight: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>I feel pressured</Text>
        </View>
        <View style={{
          backgroundColor: '#fff',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 20,
          marginRight: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>I feel stressed</Text>
        </View>
        <View style={{
          backgroundColor: '#fff',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 20,
          marginRight: 8,
          borderWidth: 1,
          borderColor: '#e0e3e6'
        }}>
          <Text style={{ fontSize: 12, color: '#5a403f' }}>I need support</Text>
        </View>
      </ScrollView>

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
          />
          <Text
            onPress={handleSendMessage}
            style={{ fontSize: 18, marginLeft: 8 }}>
            ➜
          </Text>
        </View>
      </View>
    </View>
  );
}
