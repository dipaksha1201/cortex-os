import React, { useState } from 'react';
import style from "./styles/ReasoningStep.module.css";
import ReactMarkdown from 'react-markdown';

interface ReasoningMessageProps {
    query: string;
    properties: string;
    context: string;
}

function breakProperties(properties: string): string[] {
    return properties
        .split(',')
        .map(property => property.trim())
        .filter(property => property.length > 0);
}

interface PropertiesListProps {
    items: string[];
}

const PropertyList: React.FC<PropertiesListProps> = ({ items }) => (
    <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    }}>
        {items.map((item, i) => (
            <div
                key={i}
                style={{
                    background: '#f1f1f1',
                    padding: '0.1vw 0.6vw',
                    fontSize: '0.9em',
                    borderRadius: '16px',
                }}
            >
                {item}
            </div>
        ))}
    </div>
);

interface ContextProps {
    text: string;
}

const Context: React.FC<ContextProps> = ({ text }) => {
    return (
        <div style={{ whiteSpace: 'pre-wrap', color: 'rgba(0, 0, 0, 0.6)', }}>
            <ReactMarkdown>{text || ''}</ReactMarkdown>
        </div>
    );
};

const ToggleStep: React.FC<ReasoningMessageProps> = ({ query, properties, context }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.stepLarge}>
            <div className={style.subqueryTitle} onClick={() => setIsOpen(!isOpen)}>
                <div className={style.checkIcon}></div>
                <div>{query}</div>
            </div>
            {isOpen && (
                <>
                    <PropertyList items={breakProperties(properties)} />
                    <Context text={context} />
                </>
            )}
        </div>
    );
};

interface ReasoningStepListProps {
    messages: ReasoningMessageProps[];
}

const ReasoningStep: React.FC<ReasoningStepListProps> = ({ messages }) => {
    return (
        <div className={style.reasoningStepContainer}>
            {/* Header */}
            <div className={style.header}>
                <h2 className={style.title}>Resoning</h2>
                <span className={style.sourceCount}>{messages.length} steps</span>
            </div>

            {messages.map((msg, index) => (
                <ToggleStep key={index} {...msg} />
            ))}
        </div>
    );
};

export default ReasoningStep;