import React, { useState, useEffect } from 'react';
import StreamingChatInterface from './StreamingChatInterface';
import { getChatHistory, deleteConversation } from '../../services/chatService';
import styles from './styles/StreamingChat.module.css';

interface StreamingChatProps {
    userId: string;
    initialQuery?: string;
}

const StreamingChat: React.FC<StreamingChatProps> = ({ userId, initialQuery }) => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch conversation history on component mount
    useEffect(() => {
        fetchConversations();
    }, [userId]);

    const fetchConversations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const history = await getChatHistory(userId);
            setConversations(history.conversations || []);
            // Select the most recent conversation by default
            if (history.conversations && history.conversations.length > 0) {
                setSelectedConversationId(history.conversations[0]._id);
            }
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
            setError('Failed to load conversation history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setSelectedConversationId(null);
    };

    const handleDeleteConversation = async (id: string) => {
        try {
            await deleteConversation(id);
            // Remove from local state
            setConversations(prev => prev.filter(conv => conv._id !== id));
            // If the deleted conversation was selected, clear selection
            if (selectedConversationId === id) {
                setSelectedConversationId(null);
            }
        } catch (err) {
            console.error('Failed to delete conversation:', err);
            setError('Failed to delete conversation');
        }
    };

    const selectedConversation = conversations.find(
        conv => conv._id === selectedConversationId
    );

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <button
                    className={styles.newChatButton}
                    onClick={handleNewChat}
                >
                    New Chat
                </button>

                <div className={styles.conversationList}>
                    {isLoading ? (
                        <div className={styles.loading}>Loading conversations...</div>
                    ) : error ? (
                        <div className={styles.error}>{error}</div>
                    ) : conversations.length === 0 ? (
                        <div className={styles.empty}>No conversations yet</div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv._id}
                                className={`${styles.conversationItem} ${selectedConversationId === conv._id ? styles.selected : ''}`}
                                onClick={() => setSelectedConversationId(conv._id)}
                            >
                                <div className={styles.conversationTitle}>
                                    {conv.title || 'Untitled Conversation'}
                                </div>
                                <button
                                    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteConversation(conv._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.chatArea}>
                <StreamingChatInterface
                    conversation={selectedConversation}
                    shouldSendMessage={false}
                    initialQuery={initialQuery}
                />
            </div>
        </div>
    );
};

export default StreamingChat; 