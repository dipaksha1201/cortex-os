import { useState, useEffect, ComponentType } from "react";
import { ChatInput } from "./ChatInput";
import ChatMessage from "./ChatMessage";
import styles from "./styles/ChatInterface.module.css";
import { streamChatMessage } from "../../services/chatService";

interface Conversation {
    _id: any;
    messages: any[];
}

interface ChatContentProps {
    conversation?: Conversation;
    shouldSendMessage?: boolean;
    initialQuery?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ conversation, shouldSendMessage = false, initialQuery = "" }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [conversatonId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initialMessages = conversation?.messages ?? [];
        const initialConversationId = conversation?._id ?? null;
        setMessages(initialMessages);
        setConversationId(initialConversationId);

        // Optionally call handleSendMessage during initialization
        if (shouldSendMessage && initialQuery) {
            handleSendMessage(initialQuery);
        }
    }, [conversation, shouldSendMessage, initialQuery]);

    const handleSendMessage = async (query: string) => {
        const userMessage = {
            content: query,
            sender: 'user',
        };

        console.log("User message:", userMessage);

        const userUpdatedMessages = [...messages, userMessage];
        setMessages(userUpdatedMessages);
        setIsLoading(true);

        let updatedMessages: any;
        (async () => {
            try {
                const result = await streamChatMessage(conversatonId, "dipak", query, {
                    onStream: (data) => {
                        console.log("Stream data:", data);
                    },
                    onFinished: () => {
                        console.log("Stream finished");
                    },
                    onError: (error) => {
                        console.error("Stream error:", error);
                    }
                });
            } finally {
                setIsLoading(false);
            }
        })();
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesList}>
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} sender={msg.sender} />
                ))}
                {isLoading && <div className={styles.loading}>Working...</div>}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default function ChatInterface(props: { conversation?: Conversation; shouldSendMessage?: boolean; initialQuery?: string }) {
    const convo = props.conversation || { messages: [], _id: null };
    return (
        <ChatContent conversation={convo} shouldSendMessage={props.shouldSendMessage} initialQuery={props.initialQuery} />
    );
}