import { useChatStore, Message } from '@/stores/chatStore';

interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class AIService {
  private config: AIConfig;

  constructor() {
    this.config = {
      apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
      baseUrl: process.env.EXPO_PUBLIC_OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async sendMessage(
    messages: Message[], 
    conversationId: string,
    onPartialResponse?: (text: string) => void
  ): Promise<AIResponse> {
    try {
      // Convert messages to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text,
      }));

      // Add system prompt for Chatly
      const systemPrompt = {
        role: 'system',
        content: `You are Chatly, a helpful AI assistant. You are friendly, knowledgeable, and always ready to help users with their questions, problems, or creative tasks. Keep your responses concise but comprehensive.`
      };

      const requestData = {
        model: this.config.model,
        messages: [systemPrompt, ...openAIMessages],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: false, // TODO: Implement streaming later
      };

      const response = await this.makeRequest('/chat/completions', requestData);
      
      return {
        text: response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Return fallback response
      return {
        text: 'I\'m having trouble connecting to my AI service right now. Please try again in a moment.',
      };
    }
  }

  async generateConversationTitle(firstMessage: string): Promise<string> {
    try {
      const requestData = {
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'Generate a short, descriptive title for a conversation that starts with this message. Keep it under 5 words. Return only the title, nothing else.',
          },
          {
            role: 'user',
            content: firstMessage,
          },
        ],
        max_tokens: 20,
        temperature: 0.5,
      };

      const response = await this.makeRequest('/chat/completions', requestData);
      return response.choices[0]?.message?.content?.trim() || 'New Chat';
    } catch (error) {
      console.error('Title generation error:', error);
      return 'New Chat';
    }
  }

  // Mock AI service for development/testing
  async mockSendMessage(
    messages: Message[],
    conversationId: string
  ): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lastMessage = messages[messages.length - 1]?.text || '';
    
    const responses = [
      "That's an interesting question! Let me think about that for a moment.",
      "I understand what you're asking. Here's what I would suggest:",
      "Great point! Based on that, I'd recommend the following approach:",
      "That's a thoughtful question. From my perspective, I believe:",
      "I can help you with that! Here's what you should consider:",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: `${randomResponse}\n\nRegarding "${lastMessage.substring(0, 50)}..." - I think there are several ways to approach this. Would you like me to elaborate on any specific aspect?`,
    };
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== '';
  }

  // Get current configuration (without sensitive data)
  getConfig() {
    return {
      baseUrl: this.config.baseUrl,
      model: this.config.model,
      isConfigured: this.isConfigured(),
    };
  }
}

export const aiService = new AIService();

// React hook for using AI service
export const useAI = () => {
  const { addMessage, updateConversationTitle } = useChatStore();

  const sendMessage = async (
    conversationId: string,
    userMessage: string,
    messages: Message[]
  ): Promise<void> => {
    // Add user message
    addMessage(conversationId, userMessage, 'user');

    try {
      // Generate title if this is the first message
      if (messages.length === 0) {
        const title = await aiService.generateConversationTitle(userMessage);
        updateConversationTitle(conversationId, title);
      }

      // Get AI response
      const response = aiService.isConfigured()
        ? await aiService.sendMessage([...messages, { 
            id: Date.now().toString(), 
            text: userMessage, 
            sender: 'user', 
            timestamp: new Date(), 
            conversationId 
          }], conversationId)
        : await aiService.mockSendMessage([...messages, { 
            id: Date.now().toString(), 
            text: userMessage, 
            sender: 'user', 
            timestamp: new Date(), 
            conversationId 
          }], conversationId);

      // Add AI response
      addMessage(conversationId, response.text, 'ai');
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage(conversationId, 'Sorry, I encountered an error. Please try again.', 'ai');
    }
  };

  return { sendMessage, isConfigured: aiService.isConfigured() };
};
