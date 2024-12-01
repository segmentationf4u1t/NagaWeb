import { Loader2 } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 text-gray-400">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span className="text-xs">AI is typing...</span>
    </div>
  )
}

