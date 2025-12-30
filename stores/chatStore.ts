import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  category?: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, text: string, sender: 'user' | 'ai') => void;
  updateConversationTitle: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  searchConversations: (query: string) => Conversation[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isLoading: false,
      error: null,

      createConversation: (title?: string) => {
        const id = Date.now().toString();
        const newConversation: Conversation = {
          id,
          title: title || 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
        };

        set(state => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: id,
        }));

        return id;
      },

      deleteConversation: (id: string) => {
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== id),
          activeConversationId: state.activeConversationId === id 
            ? null 
            : state.activeConversationId,
        }));
      },

      setActiveConversation: (id: string) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId: string, text: string, sender: 'user' | 'ai') => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text,
          sender,
          timestamp: new Date(),
          conversationId,
        };

        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      updateConversationTitle: (id: string, title: string) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
          ),
        }));
      },

      togglePinConversation: (id: string) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
          ),
        }));
      },

      searchConversations: (query: string) => {
        const { conversations } = get();
        if (!query.trim()) return conversations;

        return conversations.filter(conv =>
          conv.title.toLowerCase().includes(query.toLowerCase()) ||
          conv.messages.some(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
          )
        );
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
