// src/components/chat/ChatMessage.tsx
import React from 'react';
import styles from './styles/ChatMessage.module.css';
import ReactMarkdown from 'react-markdown';
import ReasoningStep from './ReasoningStep';
import { ChatTable } from "./ChatTable";

export interface ChatMessageProps {
    message: any | CortexResponse;
    sender: string;
}

interface UserMessageProps {
    message: string;
}

interface CortexResponse {
    reasoning: ReasoningMessageProps[];
    content: string;
    table: [];
}


interface ReasoningMessageProps {
    query: string;
    properties: string;
    context: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
    return (
        <div className={styles.userMessageContainer}>
            <div className={styles.userMessage}>
                {message}
            </div>
        </div>
    );
}
interface CortexResponseProps {
    message: CortexResponse;
}

function FinalAnswer({ message }: { message: any }) {
    // const formattedMessage = message.replace(/\n/g, '\n\n');
    console.log("Final Answer:", message);
    return (
        <div style={{ width: '100%', overflowY: 'auto', overflowX: 'auto' }}>
            <ReactMarkdown>{message || ''}</ReactMarkdown>
        </div>
    );
}


const CortexResponse: React.FC<CortexResponseProps> = ({ message }) => {
    console.log("Rendering Cortex Response:", message);
    return (
        <>
            <div className={styles.cortexResponse}>
                {message.reasoning && message.reasoning.length > 0 && <ReasoningStep messages={message.reasoning} />}
                <FinalAnswer message={message.content} />
            </div>
            {message.table && message.table.length > 0 && <ChatTable jsonData={message.table} />}
        </>
    );
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
    if (sender === 'user') {
        // If sender is 'user', message must be string
        console.log("User message:", message);
        return <UserMessage message={message.content as string} />;
    }

    // If message is an object with a reasoning array and final_answer string
    if (
        typeof message === 'object' &&
        message !== null
    ) {
        return (
            <>
                <CortexResponse message={message} />
            </>
        );
    }

    // Fallback for an unexpected scenario
    return <div>Invalid message format</div>;
};

export default ChatMessage;