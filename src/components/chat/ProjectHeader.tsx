import { FileText } from "lucide-react"

export function ProjectHeader() {
  return (
    <header className="flex items-center gap-4 mb-6">
      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="h-6 w-6 text-gray-600" />
      </div>
      <h1 className="text-2xl font-bold">Project X</h1>
    </header>
  )
}
