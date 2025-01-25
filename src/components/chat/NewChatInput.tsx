import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Paperclip } from "lucide-react"

export function NewChatInput() {
  return (
    <Card className="p-4 bg-gray-50 rounded-3xl">
      <div className="text-sm text-gray-600 mb-2">New chat in this project</div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
