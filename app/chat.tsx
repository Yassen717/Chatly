import { IconSymbol } from '@/components/ui/icon-symbol';
import { useChatStore } from '@/stores/chatStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const { activeConversationId, getConversation, sendMessage, isLoading } = useChatStore();
    const activeConversation = activeConversationId ? getConversation(activeConversationId) : null;
    const messages = activeConversation?.messages || [];

    // We should probably redirect if no active conversation, but for now let's handle new chat creation in store

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Scroll to bottom on updates
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const text = message;
        setMessage('');

        await sendMessage(text, activeConversationId || undefined);
    };

    const renderMessage = ({ item, index }: { item: any, index: number }) => {
        const isUser = item.sender === 'user';
        const isLast = index === messages.length - 1;

        return (
            <Animated.View
                entering={FadeInUp.delay(50).springify()}
                style={[
                    styles.messageRow,
                    isUser ? styles.rowUser : styles.rowAi
                ]}
            >
                {!isUser && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarGradient}>
                            {/* Placeholder for AI Avatar Image */}
                            <View style={styles.avatarInner} />
                        </View>
                    </View>
                )}

                <View style={[styles.bubbleContainer, isUser ? styles.bubbleUser : styles.bubbleAi]}>
                    {!isUser && <Text style={styles.aiName}>Chatly</Text>}
                    <View style={[
                        styles.bubble,
                        isUser ? styles.bubbleContentUser : styles.bubbleContentAi,
                        isUser ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }
                    ]}>
                        <Text style={[styles.messageText, isUser ? styles.textUser : styles.textAi]}>
                            {item.text}
                        </Text>
                    </View>
                </View>

                {isUser && (
                    <View style={styles.metaContainer}>
                        <Text style={styles.timestamp}>
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <IconSymbol name="checkmark.circle.fill" size={14} color="rgba(255,255,255,0.4)" />
                    </View>
                )}
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
                    </Pressable>
                    <View style={styles.headerAvatarContainer}>
                        <View style={styles.headerAvatarGradient}>
                            <View style={styles.headerAvatarInner} />
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Chatly</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>
                <Pressable style={styles.settingsButton}>
                    <IconSymbol name="gearshape" size={24} color="#FFFFFF" />
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

                {/* Date Separator */}
                <Animated.View entering={FadeInUp.delay(500)} style={styles.dateSeparator}>
                    <Text style={styles.dateText}>Today</Text>
                </Animated.View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <IconSymbol name="message.fill" size={48} color="rgba(255,255,255,0.1)" />
                            <Text style={styles.emptyText}>Start a new conversation</Text>
                        </View>
                    }
                    ListFooterComponent={
                        isLoading ? (
                            <Animated.View entering={FadeInUp} exiting={FadeOut} style={styles.typingContainer}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatarGradient}>
                                        <View style={styles.avatarInner} />
                                    </View>
                                </View>
                                <View style={[styles.bubble, styles.bubbleContentAi, styles.typingBubble]}>
                                    <View style={styles.typingDot} />
                                    <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
                                    <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
                                </View>
                            </Animated.View>
                        ) : null
                    }
                />

                <View style={styles.inputToolbar}>
                    <Pressable style={styles.attachButton}>
                        <IconSymbol name="plus" size={24} color="#9ca3af" />
                    </Pressable>
                    <View style={styles.inputFieldContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message Chatly..."
                            placeholderTextColor="#9ca3af"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <Pressable style={styles.micButton}>
                            <IconSymbol name="mic.fill" size={20} color="#9ca3af" />
                        </Pressable>
                    </View>
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
        backgroundColor: '#101022', // background-dark
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(16, 16, 34, 0.9)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
        marginRight: -4,
    },
    headerAvatarContainer: {
        width: 40,
        height: 40,
        position: 'relative',
    },
    headerAvatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: '#4facfe', // gradient start
        padding: 2,
    },
    headerAvatarInner: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 18,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        backgroundColor: '#00ff9d',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#101022',
    },
    headerTextContainer: {
        gap: 2,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerStatus: {
        fontSize: 12,
        color: '#1313ec', // primary
        fontWeight: '600',
    },
    settingsButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
    dateSeparator: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 11,
        color: '#9ca3af',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },
    messagesList: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        gap: 12,
    },
    rowUser: {
        justifyContent: 'flex-end',
    },
    rowAi: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        marginBottom: 4,
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        backgroundColor: '#4facfe',
        padding: 1,
    },
    avatarInner: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
    },
    bubbleContainer: {
        maxWidth: '75%',
        gap: 4,
    },
    bubbleUser: {
        alignItems: 'flex-end',
    },
    bubbleAi: {
        alignItems: 'flex-start',
    },
    aiName: {
        fontSize: 11,
        color: '#9ca3af',
        marginLeft: 16,
        fontWeight: '500',
    },
    bubble: {
        padding: 16,
        borderRadius: 20,
    },
    bubbleContentUser: {
        backgroundColor: '#1313ec', // primary
    },
    bubbleContentAi: {
        backgroundColor: '#1e1e2f', // surface-dark
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textUser: {
        color: '#FFFFFF',
    },
    textAi: {
        color: '#FFFFFF',
    },
    metaContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: 6,
        gap: 2,
        alignItems: 'flex-end',
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
        gap: 12,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 48,
        borderBottomLeftRadius: 4,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1313ec',
        opacity: 0.6,
    },
    inputToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        backgroundColor: 'rgba(16, 16, 34, 0.8)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    attachButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1e1e2f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputFieldContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e2f',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 44,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 10,
    },
    micButton: {
        padding: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1313ec',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1313ec',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    sendButtonDisabled: {
        backgroundColor: '#1e1e2f',
        opacity: 0.5,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
    },
});
