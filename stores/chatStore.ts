import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  conversationId: string;
  metadata?: {
    tokenCount?: number;
    model?: string;
    isError?: boolean;
    isStreaming?: boolean;
    streamId?: string;
    partialText?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  category?: string;
  context?: {
    systemPrompt?: string;
    modelConfig?: {
      temperature?: number;
      topK?: number;
      topP?: number;
      maxTokens?: number;
    };
    messageLimit?: number;
    tokenUsage?: {
      total?: number;
      prompt?: number;
      completion?: number;
    };
  };
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  contextManager: {
    maxTokens: number;
    maxMessages: number;
    systemPrompt: string;
  };
  
  // Actions
  createConversation: (title?: string, systemPrompt?: string) => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, text: string, sender: 'user' | 'ai', metadata?: Message['metadata']) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  updateConversationTitle: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  searchConversations: (query: string) => Conversation[];
  getConversationContext: (conversationId: string, limit?: number) => Message[];
  updateContextConfig: (conversationId: string, config: Partial<Conversation['context']>) => void;
  clearOldMessages: (conversationId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Default context configuration
const DEFAULT_CONTEXT = {
  maxTokens: 4000,
  maxMessages: 50,
  systemPrompt: 'You are Chatly, a helpful AI assistant. You are friendly, knowledgeable, and always ready to help users with their questions, problems, or creative tasks. Keep your responses concise but comprehensive.',
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isLoading: false,
      error: null,
      contextManager: DEFAULT_CONTEXT,

      createConversation: (title?: string, systemPrompt?: string) => {
        const id = Date.now().toString();
        const newConversation: Conversation = {
          id,
          title: title || 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
          context: {
            systemPrompt: systemPrompt || DEFAULT_CONTEXT.systemPrompt,
            modelConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxTokens: 1024,
            },
            messageLimit: DEFAULT_CONTEXT.maxMessages,
            tokenUsage: {
              total: 0,
              prompt: 0,
              completion: 0,
            },
          },
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

      addMessage: (conversationId: string, text: string, sender: 'user' | 'ai', metadata?: Message['metadata']) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text,
          sender,
          timestamp: new Date(),
          conversationId,
          metadata,
        };

        set(state => ({
          conversations: state.conversations.map(conv => {
            if (conv.id === conversationId) {
              const updatedMessages = [...conv.messages, newMessage];
              
              // Clear old messages if exceeding limit
              const maxMessages = conv.context?.messageLimit || DEFAULT_CONTEXT.maxMessages;
              const messagesToKeep = updatedMessages.slice(-maxMessages);
              
              // Update token usage
              const tokenUsage = { ...(conv.context?.tokenUsage || { total: 0, prompt: 0, completion: 0 }) };
              if (metadata?.tokenCount) {
                if (sender === 'user') {
                  tokenUsage.prompt = (tokenUsage.prompt || 0) + metadata.tokenCount;
                } else {
                  tokenUsage.completion = (tokenUsage.completion || 0) + metadata.tokenCount;
                }
                tokenUsage.total = (tokenUsage.total || 0) + metadata.tokenCount;
              }

              return {
                ...conv,
                messages: messagesToKeep,
                updatedAt: new Date(),
                context: {
                  ...conv.context,
                  tokenUsage,
                },
              };
            }
            return conv;
          }),
        }));
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set(state => ({
          conversations: state.conversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: conv.messages.map(msg => 
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date(),
              };
            }
            return conv;
          }),
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

        return conversations.filter(conv => {
          const matchesTitle = conv.title.toLowerCase().includes(query.toLowerCase());
          const matchesMessages = conv.messages.some(msg => 
            msg.text.toLowerCase().includes(query.toLowerCase())
          );
          return matchesTitle || matchesMessages;
        });
      },

      getConversationContext: (conversationId: string, limit = 10) => {
        const { conversations } = get();
        const conversation = conversations.find(conv => conv.id === conversationId);
        
        if (!conversation) return [];

        // Return the last N messages for context
        const recentMessages = conversation.messages.slice(-limit);
        
        // Include system prompt if available
        if (conversation.context?.systemPrompt && recentMessages.length === 0) {
          return [
            {
              id: 'system',
              text: conversation.context.systemPrompt,
              sender: 'ai' as const,
              timestamp: new Date(),
              conversationId,
            },
          ];
        }

        return recentMessages;
      },

      updateContextConfig: (conversationId: string, config: Partial<Conversation['context']>) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId 
              ? { 
                  ...conv, 
                  context: { ...conv.context, ...config },
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      clearOldMessages: (conversationId: string) => {
        const { conversations } = get();
        const conversation = conversations.find(conv => conv.id === conversationId);
        
        if (!conversation) return;

        const maxMessages = conversation.context?.messageLimit || DEFAULT_CONTEXT.maxMessages;
        if (conversation.messages.length > maxMessages) {
          const messagesToKeep = conversation.messages.slice(-maxMessages);
          
          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === conversationId 
                ? { 
                    ...conv, 
                    messages: messagesToKeep,
                    updatedAt: new Date(),
                  }
                : conv
            ),
          }));
        }
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
      // Custom serialization for Date objects
      partialize: (state) => ({
        ...state,
        conversations: state.conversations.map(conv => ({
          ...conv,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
          messages: conv.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.conversations = state.conversations.map(conv => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
        }
      },
    }
  )
);
