import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatItem } from "@/src/data/chatData"

interface ChatListProps {
  chatItems: ChatItem[]
}

export function ChatList({ chatItems }: ChatListProps) {
  return (
    <div>
      <h2 className="text-sm font-medium mb-3">Chats in this project</h2>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {chatItems.map((item, index) => (
            <Card key={index} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">{item.title}</h3>
              {item.preview && <p className="text-sm text-gray-500 truncate">{item.preview}</p>}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
