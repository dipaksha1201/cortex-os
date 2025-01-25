import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw } from "lucide-react"

export function ProjectActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium mb-1">Add files</h2>
            <p className="text-sm text-gray-500">Chats in this project can access file content</p>
          </div>
          <Button variant="ghost" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div>
          <h2 className="font-medium mb-1">Instructions</h2>
          <p className="text-sm text-gray-500 truncate">
            I will give you a question after the question is provide...
          </p>
        </div>
      </Card>
    </div>
  )
}
