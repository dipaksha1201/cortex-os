import { useEffect, useState } from "react"
import { ChatItem } from "@/src/data/chatData"
import { chatService } from "@/src/services/chatService"
import { ProjectHeader } from "./ProjectHeader"
import { NewChatInput } from "./NewChatInput"
import { ProjectActions } from "./ProjectActions"
import { ChatList } from "./ChatList"

export default function ChatInterface() {
  const [chatItems, setChatItems] = useState<ChatItem[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      const items = await chatService.getChatItems()
      setChatItems(items)
    }
    fetchChats()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <ProjectHeader />
      <NewChatInput />
      <ProjectActions />
      <ChatList chatItems={chatItems} />
    </div>
  )
}
