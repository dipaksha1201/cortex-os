import { useEffect, useState } from "react"
import { ChatItem } from "@/src/data/chatData"
import { chatService } from "@/src/services/chatService"
import { ProjectHeader } from "./ProjectHeader"
import { NewChatInput } from "./NewChatInput"
import { ProjectActions } from "./ProjectActions"
import { ChatList } from "./ChatList"
import { Navbar } from "./Navbar"
import { Header } from "./Header"
import styles from './styles/Navbar.module.css'
import chatStyles from './styles/ChatInterface.module.css'

export default function ChatInterface() {
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  useEffect(() => {
    const fetchChats = async () => {
      const items = await chatService.getChatItems()
      setChatItems(items)
    }
    fetchChats()
  }, [])

  return (
    <>
      <Navbar onToggle={setIsNavCollapsed} />
      <Header isNavCollapsed={isNavCollapsed} />
      <main className={`${styles.mainContent} ${isNavCollapsed ? styles.shifted : ''}`}> 
        <ProjectHeader />
        <NewChatInput />
        <ProjectActions />
        <ChatList chatItems={chatItems} />
      </main>
    </>
  )
}
