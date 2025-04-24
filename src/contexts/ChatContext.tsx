
import React, { createContext, useContext, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isChatVisible: boolean;
  setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m Audrey, your compliance assistant. How can I help you with NIS2 or SOX compliance today?'
    }
  ]);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isChatVisible, setIsChatVisible }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
