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

// Interface for the ReasoningStep component
export interface ReasoningMessageProps {
    subquery: string;
    response: string;
}


interface CortexResponse {
    reasoning: ReasoningMessageProps[];
    content: string;
    table: [];
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

function cleanMessage(message: string): string {
    return message.replace(/```text|```/g, '');
}

function FinalAnswer({ message }: { message: any }) {
    const cleanedMessage = cleanMessage(message);
    console.log("Final Answer:", cleanedMessage);
    return (
        <div className="markdown-container" style={{ width: '100%', overflowY: 'auto' }}>
            <ReactMarkdown>{cleanedMessage || ''}</ReactMarkdown>
        </div>
    );
}


const CortexResponse: React.FC<CortexResponseProps> = ({ message }) => {
    console.log("Rendering Cortex Response:", message);

    // Map the reasoning data to match the expected format
    const mappedReasoning = message.reasoning?.map(item => ({
        subquery: item.subquery || '',
        response: item.response || ''
    }));

    return (
        <>
            <div className={styles.cortexResponse}>
                {mappedReasoning && mappedReasoning.length > 0 && <ReasoningStep messages={mappedReasoning} />}
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
        console.log("Cortex Response:", message);
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