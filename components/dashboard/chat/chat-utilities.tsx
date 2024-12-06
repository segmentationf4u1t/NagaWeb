interface ChatUtilitiesProps {
    totalTokens: number
    totalMessages: number
    tokensPerSecond: number
  }
  
  export function ChatUtilities({ totalTokens, totalMessages, tokensPerSecond }: ChatUtilitiesProps) {
    return (
      <div className="px-3 py-2 bg-neutral-800 text-neutral-400 text-xs flex justify-between items-center border-t border-gray-700">
        <div>Tokens: {totalTokens}</div>
        <div>Messages: {totalMessages}</div>
        <div>{tokensPerSecond} tok/s</div>
      </div>
    )
  }
  
  