import React, { useState, useEffect, useRef } from 'react';
import { streamChatMessage, ChatWebSocketService } from '../../services/chatService';
import ChatMessage from './ChatMessage';
import styles from './styles/ChatInterface.module.css';
import dotenv from 'dotenv';
import ChatInput from './ChatInput';

// Load environment variables from .env file
dotenv.config();
console.log('API_BASE_URL_DOC_SERVICE:', process.env.API_BASE_URL_DOC_SERVICE);

interface Conversation {
    _id: any;
    messages: any[];
}

interface StreamingChatInterfaceProps {
    conversation?: Conversation;
    shouldSendMessage?: boolean;
    initialQuery?: string;
}

const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({
    conversation,
    shouldSendMessage = false,
    initialQuery = ''
}) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const disconnectRef = useRef<(() => void) | null>(null);
    const inactivityTimeoutRef = useRef<NodeJS.Timeout>();
    const INACTIVITY_TIMEOUT = 1000 * 60 * 5; // 5 minutes
    const wsServiceRef = useRef<ChatWebSocketService | null>(null);

    const resetInactivityTimeout = () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        inactivityTimeoutRef.current = setTimeout(() => {
            if (disconnectRef.current && connectionStatus === 'connected') {
                disconnectRef.current();
                setConnectionStatus('disconnected');
            }
        }, INACTIVITY_TIMEOUT);
    };

    // Auto-dismiss error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    // Initialize with conversation data if provided
    useEffect(() => {
        const initialMessages = conversation?.messages ?? [];
        const initialConversationId = conversation?._id ?? null;
        console.log('API_BASE_URL_DOC_SERVICE:', process.env.API_BASE_URL_DOC_SERVICE);
        setMessages(initialMessages);
        setConversationId(initialConversationId);

        // Optionally send initial message
        if (shouldSendMessage && initialQuery) {
            handleSendMessage(initialQuery);
        }
    }, [conversation, shouldSendMessage, initialQuery]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize WebSocket connection
    useEffect(() => {

        // Create new connection
        wsServiceRef.current = new ChatWebSocketService('dipak', conversationId)
            .connect()
            .onStream((data) => {
                // Reset inactivity timeout on each stream chunk
                resetInactivityTimeout();

                // Update the response based on stream data
                setMessages(prev => {
                    const updated = [...prev];
                    const tempResponseIndex = updated.length - 1;
                    const reasoning = [...(updated[tempResponseIndex]?.reasoning || [])];

                    if (data.type === 'query') {
                        // Check if there's an incomplete reasoning entry
                        const lastReasoning = reasoning[reasoning.length - 1];
                        if (lastReasoning && !lastReasoning.response) {
                            // Update existing incomplete subquery
                            lastReasoning.subquery = data.content || '';
                        } else {
                            // Create new entry only if last one is complete
                            reasoning.push({
                                subquery: data.content || '',
                                response: ''
                            });
                        }
                        updated[tempResponseIndex].reasoning = reasoning;
                    }
                    else if (data.type === 'response') {
                        if (reasoning.length > 0) {
                            reasoning[reasoning.length - 1].response = data.content || '';
                            updated[tempResponseIndex].reasoning = reasoning;
                        }
                    }
                    else if (data.type === 'response-streaming') {
                        reasoning[reasoning.length - 1].response = reasoning[reasoning.length - 1].response + data.content || '';
                        updated[tempResponseIndex].reasoning = reasoning;
                    }
                    else if (data.type === 'final-answer-streaming') {
                        updated[tempResponseIndex].content += data.content || '';
                    }
                    else if (data.type === 'complete') {
                        updated[tempResponseIndex].content = data.content || '';
                        if (data.table) updated[tempResponseIndex].table = data.table || [];
                    }

                    return updated;
                });
            })
            .onFinished(() => {
                setIsStreaming(false);
                // Update conversation ID if it was a new conversation
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.conversation_id && !conversationId) {
                        setConversationId(lastMessage.conversation_id);
                    }
                    return prev;
                });
                // Reset inactivity timeout after message completion
                resetInactivityTimeout();
            })
            .onError((error) => {
                console.error('Streaming error:', error);
                setIsStreaming(false);
                setErrorMessage(error);

                // Update the last message to show the error
                setMessages(prev => {
                    const updated = [...prev];
                    const tempResponseIndex = updated.length - 1;
                    updated[tempResponseIndex] = {
                        content: `Error: ${error}`,
                        sender: 'error'
                    };
                    return updated;
                });
            })
            .onStatusChange((status) => {
                setConnectionStatus(status);
                if (status === 'connected') {
                    resetInactivityTimeout();
                }
                console.log('WebSocket connection status:', status);
            });

        // Store disconnect function for cleanup
        disconnectRef.current = () => wsServiceRef.current?.disconnect();
    }, [conversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (query: string) => {
        // Don't send empty messages
        if (!query.trim()) return;

        // Reset error message
        setErrorMessage(null);

        // Reset inactivity timeout
        resetInactivityTimeout();

        // Add user message to UI
        const userMessage = {
            content: query,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsStreaming(true);

        // Create temporary response object
        setMessages(prev => [
            ...prev,
            {
                sender: 'cortex',
                content: '',
                reasoning: []
            }
        ]);

        // If WebSocket is not connected, wait for reconnection
        if (!wsServiceRef.current) {
            // Create new connection and wait for it to connect
            wsServiceRef.current = new ChatWebSocketService('dipak', conversationId)
                .connect();

            // Wait for connection to establish (max 5 seconds)
            let attempts = 0;
            while (attempts < 50 && connectionStatus !== 'connected') {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }

        try {
            // Send the message using existing connection
            wsServiceRef.current?.sendMessage(query);
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsStreaming(false);
            setErrorMessage(error instanceof Error ? error.message : 'Unknown error');

            // Add error message
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    sender: 'error'
                };
                return updated;
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    const getConnectionStatusClass = () => {
        switch (connectionStatus) {
            case 'connected':
                return styles.statusConnected;
            case 'connecting':
                return styles.statusConnecting;
            case 'disconnected':
                return styles.statusDisconnected;
            case 'error':
                return styles.statusError;
            default:
                return styles.statusDisconnected;
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.connectionStatus}>
                <span className={getConnectionStatusClass()}>
                    {connectionStatus === 'connected' && 'Connected'}
                    {connectionStatus === 'connecting' && 'Connecting...'}
                    {connectionStatus === 'disconnected' && 'Disconnected'}
                    {connectionStatus === 'error' && 'Connection Error'}
                </span>
            </div>

            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        sender={message.sender}
                    />
                ))}
                {isStreaming && (
                    <div className={styles.streamingIndicator}>
                        <div className={styles.streamingDot}></div>
                        <div className={styles.streamingDot}></div>
                        <div className={styles.streamingDot}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {errorMessage && (
                <div className={styles.errorBanner}>
                    {errorMessage}
                </div>
            )}

            <ChatInput
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onSendMessage={() => handleSendMessage(inputValue)}
                isStreaming={isStreaming}
            />
        </div>
    );
};

export default StreamingChatInterface; 