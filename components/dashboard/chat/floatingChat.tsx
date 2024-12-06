'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import { ChatUtilities } from "./chat-utilities"

const MODEL_NAME = "o1-preview-2024-09-12"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; tokens?: number }[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [totalTokens, setTotalTokens] = useState(0)
  const [tokensPerSecond] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      setIsTyping(true)
      // Simulate LLM response (replace with actual API call in production)
      setTimeout(() => {
        setIsTyping(false)
        const aiResponse = `You said: ${input}`
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, tokens: 0 }])
        setTotalTokens(prev => prev)
      }, 2000)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className={`w-72 sm:w-80 ${isMinimized ? 'h-14' : 'h-[28rem]'} flex flex-col shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ease-in-out bg-neutral-950`}>
          <div className="p-2 border-b border-neutral-800 flex justify-between items-center bg-gradient-to-r from-neutral-900 to-neutral-950">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-200">{MODEL_NAME}</h2>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6 rounded-full p-0 text-neutral-400 hover:text-neutral-200">
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 rounded-full p-0 text-neutral-400 hover:text-neutral-200">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <>
              <ScrollArea className="flex-grow p-4 bg-neutral-900 bg-opacity-50 backdrop-filter backdrop-blur-sm" ref={scrollAreaRef}>
                {messages.map((message, index) => (
                  <ChatMessage key={`${message.role}-${index}`} role={message.role} content={message.content} tokens={message.tokens} />
                ))}
                {isTyping && <TypingIndicator />}
              </ScrollArea>
              <ChatUtilities totalTokens={totalTokens} totalMessages={messages.length} tokensPerSecond={tokensPerSecond} />
              <form onSubmit={handleSubmit} className="p-2 border-t border-neutral-800 bg-neutral-900 bg-opacity-70 backdrop-filter backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow rounded-full text-sm bg-neutral-800 border-neutral-700 text-neutral-200 placeholder-neutral-500"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 transition-all duration-200 ease-in-out"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="sr-only">Open Chat</span>
        </Button>
      )}
    </div>
  )
}

