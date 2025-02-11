import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatItem } from "@/src/data/chatData"
import styles from '../styles/ChatList.module.css'

interface ChatListProps {
  chatItems: ChatItem[]
}

export function ChatList({ chatItems }: ChatListProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>History</h2>
      <ScrollArea className={styles.scrollArea}>
        <div className={styles.chatList}>
          {chatItems.map((item, index) => (
            <Card key={index} className={styles.chatCard}>
              <h3 className={styles.chatTitle}>{item.title}</h3>
              {item.preview && <p className={styles.chatPreview}>{item.preview}</p>}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
