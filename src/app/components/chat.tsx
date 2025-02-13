import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { characterService } from "@/services/api";
import { Character } from "@/services/api/types/character-types";

export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  error?: boolean;
}

interface ChatModuleProps {
  character: Character;
}

const ChatModule = ({ character }: ChatModuleProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content: trimmedMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    setError(null);
    try {
      const apiResponse = await characterService.chatWith(
        character.id,
        trimmedMessage,
        messages
      );

      const characterMessage: Message = {
        id: Date.now() + 1,
        content: apiResponse.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, characterMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");

      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Failed to send message. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        error: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-yellow-400">
          Chat with {character.name}
        </h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Start a conversation with {character.name}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-yellow-400 text-black"
                  : message.error
                  ? "bg-red-900/50 text-red-200"
                  : "bg-gray-800 text-gray-300"
              } transition-all duration-200`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-300 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{character.name} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Send a message to ${character.name}...`}
            className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black rounded-lg px-4 py-2 hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !newMessage.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Send
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default ChatModule;
