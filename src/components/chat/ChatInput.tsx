import React from 'react';
import styles from './styles/ChatInterface.module.css';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  isStreaming: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isStreaming
}) => {
  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        placeholder="Ask cortex..."
        disabled={isStreaming}
        className={styles.chatInput}
      />
      <button
        onClick={onSendMessage}
        disabled={isStreaming || !inputValue.trim()}
        className={styles.sendButton}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
