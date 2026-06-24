import { useState, useCallback } from 'react';

export type ChatMessage = {
  id: number;
  type: 'user' | 'assistant';
  text: string;
};

export function useChatSession() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }
  ]);

  const addUserMessage = useCallback((text: string) => {
    const newId = Math.max(...messages.map(m => m.id), 0) + 1;
    setMessages(prev => [...prev, { id: newId, type: 'user', text }]);
    return newId;
  }, [messages]);

  const addAssistantMessage = useCallback((text: string) => {
    const newId = Math.max(...messages.map(m => m.id), 0) + 1;
    setMessages(prev => [...prev, { id: newId, type: 'assistant', text }]);
    return newId;
  }, [messages]);

  const clearMessages = useCallback(() => {
    // Reset to initial state
    setMessages([
      { id: 0, type: 'assistant', text: "Hi! I'm here to listen. What's on your mind?" }
    ]);
  }, []);

  const getMessageCount = useCallback(() => {
    // Exclude initial assistant message
    return messages.length - 1;
  }, [messages]);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
    getMessageCount,
  };
}
