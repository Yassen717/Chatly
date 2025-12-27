import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const INITIAL_MESSAGES = [
    {
        id: '1',
        text: 'Hi there! How can I help you today?',
        sender: 'ai',
        time: '10:30 AM',
    },
    {
        id: '2',
        text: 'I need some ideas for a new marketing campaign.',
        sender: 'user',
        time: '10:31 AM',
    },
    {
        id: '3',
        text: "Sure! What's the product or service you're promoting?",
        sender: 'ai',
        time: '10:31 AM',
    },
];

export default function ChatScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(INITIAL_MESSAGES);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                text: "That sounds interesting! Here are three concepts we could explore...",
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
                <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
                    {item.text}
                </Text>
                <Text style={styles.timestamp}>{item.time}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Assistant</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <Pressable
                        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!message.trim()}>
                        <IconSymbol name="arrow.up" size={20} color="#FFFFFF" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06081A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerRightPlaceholder: {
        width: 44,
    },
    content: {
        flex: 1,
    },
    messagesList: {
        padding: 20,
        gap: 16,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 4,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#2B4BFF',
        borderBottomRightRadius: 4,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    aiMessageText: {
        color: '#E0E0E0',
    },
    timestamp: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 6,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: '#06081A',
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2B4BFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: 'rgba(43, 75, 255, 0.3)',
    },
});
