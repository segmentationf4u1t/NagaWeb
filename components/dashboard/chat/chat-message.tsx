import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  tokens?: number
}

export const ChatMessage = React.memo(({ role, content, tokens }: ChatMessageProps) => {
  return (
    <div className={`flex items-start space-x-1.5 mb-2 ${role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
      <Avatar className="w-6 h-6">
        <AvatarFallback className="text-xs bg-gray-700 text-gray-300">{role === 'user' ? 'U' : 'AI'}</AvatarFallback>
        <AvatarImage src={role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
      </Avatar>
      <div className={`flex-1 px-2 py-1.5 rounded-xl text-sm ${role === 'assistant' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
        <p>{content}</p>
        {tokens && role === 'assistant' && (
          <p className="text-xs text-gray-400 mt-1">Tokens: {tokens}</p>
        )}
      </div>
    </div>
  )
})

