import { Card } from "@/components/ui/card"
import styles from "../styles/chat.module.css"
import { useState } from "react"

export function ChatInput({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    onSendMessage(inputValue)
    setInputValue("")
  }

  return (
    <Card className={styles.chatCard}>
      <div className={styles.header}>
        <div className={styles.headerTitle}> 🌀 Zen Mode</div>
        {/* <button onClick={handleStop} className={styles.stopButton}>
          Switch
        </button> */}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1vw',
        padding: '0 1vw',
      }}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Ask Cortex"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
      {/* <button onClick={handleSend} className={styles.sendButton}>
        Send
      </button> */}
      {/* <div className={styles.buttonContainer}>
        <button className={styles.iconButton}>
          <Mic className={styles.icon} />
        </button>
        <button className={styles.iconButton}>
          <Paperclip className={styles.icon} />
        </button>
      </div> */}
    </Card>
  )
}
