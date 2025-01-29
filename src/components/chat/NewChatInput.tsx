import { Card } from "@/components/ui/card"
import { Mic, Paperclip } from "lucide-react"
import styles from "./styles/chat.module.css"
import { useState } from "react"

export function NewChatInput() {
  const [inputValue, setInputValue] = useState("")

  const handleStop = () => {
    // Handle stop functionality
    console.log("Stop clicked")
  }

  return (
    <Card className={styles.chatCard}>
      <div className={styles.header}>
        <div className={styles.headerTitle}> 🌀 Zen Mode</div>
        <button onClick={handleStop} className={styles.stopButton}>
          Switch
        </button>
      </div>
      <input
        type="text"
        className={styles.chatInput}
        placeholder="Ask Cortex"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
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
