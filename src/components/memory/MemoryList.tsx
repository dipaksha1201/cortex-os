import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import styles from '../styles/MemoryList.module.css'


interface MemoryItem {
  title: string
  summary: string
}

interface MemoryListProps {
  memories: MemoryItem[]
}

export function MemoryList({ memories }: MemoryListProps) {
  return (
    <div className={styles.container}>
      <ScrollArea className={styles.scrollArea}>
        <div className={styles.chatList}>
          {memories.map((item, index) => (
            <Card key={index} className={styles.chatCard}>
              <h3 className={styles.chatTitle}>{item.title != null ? item.title : "Summary"}</h3>
              {item.summary && <p className={styles.chatPreview}>{item.summary}</p>}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div >
  )
}
