import { GoogleGenerativeAI } from '@google/generative-ai';
import { useChatStore, Message } from '@/stores/chatStore';

interface GeminiResponse {
  text: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

interface StreamingCallback {
  onChunk?: (text: string) => void;
  onComplete?: (finalText: string) => void;
  onError?: (error: Error) => void;
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI | null;
  private config: GeminiConfig;
  private streamingEnabled: boolean = true;

  constructor() {
    this.config = {
      apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
      modelName: process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash',
    };

    if (this.config.apiKey && this.config.apiKey !== 'your_google_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
    } else {
      this.genAI = null;
      console.warn('Gemini API key not configured. Using mock responses.');
    }
  }

  private async makeRequest(
    messages: Message[], 
    conversationId: string, 
    streaming?: StreamingCallback
  ): Promise<GeminiResponse> {
    if (!this.genAI) {
      return this.mockSendMessage(messages, conversationId, streaming);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.modelName });
      
      // Convert messages to Gemini format
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const lastMessage = messages[messages.length - 1];
      
      // Check if streaming is enabled and callbacks are provided
      if (this.streamingEnabled && streaming?.onChunk) {
        return this.handleStreamingResponse(chat, lastMessage.text, streaming);
      }

      // Non-streaming response
      const result = await chat.sendMessage(lastMessage.text);
      const response = result.response;
      const text = response.text();

      return {
        text,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage = error instanceof Error ? error : new Error('Unknown error');
      
      if (streaming?.onError) {
        streaming.onError(errorMessage);
      }
      
      // Return fallback response
      return {
        text: 'I\'m having trouble connecting to my AI service right now. Please try again in a moment.',
      };
    }
  }

  private async handleStreamingResponse(
    chat: any,
    message: string,
    streaming: StreamingCallback
  ): Promise<GeminiResponse> {
    try {
      const result = await chat.sendMessage(message);
      const response = result.response;
      
      let fullText = '';
      let accumulatedText = '';

      // Handle streaming if available
      for await (const chunk of response.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        
        if (streaming.onChunk) {
          streaming.onChunk(accumulatedText);
        }
        
        // Add small delay for smoother streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      fullText = response.text();
      
      if (streaming.onComplete) {
        streaming.onComplete(fullText);
      }

      return {
        text: fullText,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      console.error('Streaming error:', error);
      const errorMessage = error instanceof Error ? error : new Error('Streaming failed');
      
      if (streaming.onError) {
        streaming.onError(errorMessage);
      }
      
      throw error;
    }
  }

  async sendMessage(
    messages: Message[], 
    conversationId: string,
    streaming?: StreamingCallback
  ): Promise<GeminiResponse> {
    return this.makeRequest(messages, conversationId, streaming);
  }

  async sendMessageWithContext(
    conversationId: string,
    contextMessages: Message[],
    newMessage: string,
    streaming?: StreamingCallback
  ): Promise<GeminiResponse> {
    const messages = [...contextMessages, {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date(),
      conversationId,
    }];
    
    return this.makeRequest(messages, conversationId, streaming);
  }

  async generateConversationTitle(firstMessage: string): Promise<string> {
    if (!this.genAI) {
      return this.mockGenerateTitle(firstMessage);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.modelName });
      
      const prompt = `Generate a short, descriptive title for a conversation that starts with this message. Keep it under 5 words. Return only the title, nothing else.\n\nMessage: ${firstMessage}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const title = response.text().trim();
      
      return title || 'New Chat';
    } catch (error) {
      console.error('Title generation error:', error);
      return 'New Chat';
    }
  }

  // Enhanced Mock AI service with streaming simulation
  async mockSendMessage(
    messages: Message[],
    conversationId: string,
    streaming?: StreamingCallback
  ): Promise<GeminiResponse> {
    // Simulate API delay
    const delay = 1000 + Math.random() * 2000;
    const chunks = [
      "That's an interesting question! Let me think about that for a moment.",
      "I understand what you're asking. Here's what I would suggest:",
      "Great point! Based on that, I'd recommend the following approach:",
      "That's a thoughtful question. From my perspective, I believe:",
      "I can help you with that! Here's what you should consider:",
    ];

    const lastMessage = messages[messages.length - 1]?.text || '';
    const baseResponse = chunks[Math.floor(Math.random() * chunks.length)];
    const fullText = `${baseResponse}\n\nRegarding "${lastMessage.substring(0, 50)}..." - I think there are several ways to approach this. Would you like me to elaborate on any specific aspect?`;

    // Simulate streaming if callbacks are provided
    if (this.streamingEnabled && streaming?.onChunk && streaming?.onComplete) {
      const words = fullText.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        
        if (streaming.onChunk) {
          streaming.onChunk(currentText);
        }
        
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      }
      
      if (streaming.onComplete) {
        streaming.onComplete(fullText);
      }
    } else {
      // Non-streaming simulation
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return {
      text: fullText,
      usageMetadata: {
        promptTokenCount: lastMessage.split(' ').length,
        candidatesTokenCount: fullText.split(' ').length,
        totalTokenCount: (lastMessage + fullText).split(' ').length,
      },
    };
  }

  private mockGenerateTitle(firstMessage: string): string {
    const keywords = firstMessage.toLowerCase();
    
    if (keywords.includes('help') || keywords.includes('question')) {
      return 'Getting Help';
    } else if (keywords.includes('code') || keywords.includes('programming')) {
      return 'Coding Question';
    } else if (keywords.includes('write') || keywords.includes('article')) {
      return 'Writing Task';
    } else if (keywords.includes('explain') || keywords.includes('how')) {
      return 'Explanation Needed';
    } else if (keywords.includes('idea') || keywords.includes('brainstorm')) {
      return 'Brainstorming';
    }
    
    return 'New Chat';
  }

  // Enable/disable streaming
  setStreamingEnabled(enabled: boolean) {
    this.streamingEnabled = enabled;
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return !!this.config.apiKey && 
           this.config.apiKey !== '' && 
           this.config.apiKey !== 'your_google_gemini_api_key_here';
  }

  // Get current configuration (without sensitive data)
  getConfig() {
    return {
      modelName: this.config.modelName,
      isConfigured: this.isConfigured(),
      streamingEnabled: this.streamingEnabled,
    };
  }
}

export const geminiService = new GeminiAIService();

// React hook for using Gemini AI service with enhanced features
export const useAI = () => {
  const { addMessage, updateConversationTitle, getConversationContext } = useChatStore();

  const sendMessage = async (
    conversationId: string,
    userMessage: string,
    messages: Message[],
    onStreaming?: (chunk: string) => void
  ): Promise<void> => {
    // Add user message
    addMessage(conversationId, userMessage, 'user', { tokenCount: userMessage.split(' ').length });

    // Create a temporary message ID for streaming
    const tempMessageId = Date.now().toString();
    
    // Add initial AI message for streaming updates
    addMessage(conversationId, '', 'ai', { 
      model: 'gemini-1.5-flash',
      isStreaming: true 
    });

    try {
      // Generate title if this is the first message
      if (messages.length === 0) {
        const title = await geminiService.generateConversationTitle(userMessage);
        updateConversationTitle(conversationId, title);
      }

      // Get conversation context for AI
      const contextMessages = getConversationContext(conversationId, 10);
      
      // Get AI response with enhanced context and streaming
      const streamingCallbacks = {
        onChunk: (chunk: string) => {
          if (onStreaming) {
            onStreaming(chunk);
          }
          // Update the streaming message in the store
          // This would need to be implemented in the store
        },
        onComplete: (finalText: string) => {
          // Final message will be added by the calling component
        },
        onError: (error: Error) => {
          console.error('Streaming error:', error);
        }
      };
      
      const response = await geminiService.sendMessageWithContext(
        conversationId, 
        contextMessages, 
        userMessage,
        streamingCallbacks
      );

      // Add final AI response with metadata
      addMessage(conversationId, response.text, 'ai', { 
        tokenCount: response.usageMetadata?.candidatesTokenCount,
        model: 'gemini-1.5-flash',
        isStreaming: false
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage(conversationId, 'Sorry, I encountered an error. Please try again.', 'ai', { isError: true });
    }
  };

  const sendMessageWithStreaming = async (
    conversationId: string,
    userMessage: string,
    messages: Message[],
    onStreamingUpdate: (chunk: string) => void,
    onComplete: () => void
  ): Promise<void> => {
    await sendMessage(conversationId, userMessage, messages, onStreamingUpdate);
    onComplete();
  };

  return { 
    sendMessage, 
    sendMessageWithStreaming,
    isConfigured: geminiService.isConfigured(),
    setStreamingEnabled: (enabled: boolean) => geminiService.setStreamingEnabled(enabled),
    getConfig: () => geminiService.getConfig()
  };
};
