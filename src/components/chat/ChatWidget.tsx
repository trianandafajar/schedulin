"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { MessageCircle, X, Send, Bot, User, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local state for input (mandatory in AI SDK 4.0/ai@6.0 useChat)
  const [localInput, setLocalInput] = useState("");

  const { theme, toggleTheme } = useTheme();

  // In ai@6.0, useChat helpers are different
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      console.error("Chat error details:", err);
    }
  });


  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!mounted) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    const textToSend = localInput;
    setLocalInput(""); // Clear immediately for better UX

    try {
      await sendMessage({ text: textToSend });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border border-gray-200 dark:border-gray-700"
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-brand-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        id="chat-widget-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-brand-500 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Schedulin AI Assistant</h3>
                <p className="text-[10px] text-white/80">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/50"
          >
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bot size={24} />
                </div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">Halo! Ada yang bisa saya bantu terkait Schedulin?</p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${m.role === "user"
                    ? "bg-brand-500 text-white rounded-tr-none"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm"
                    }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>,
                          ol: ({ children }) => <ul className="list-decimal ml-4 space-y-1 my-2">{children}</ul>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                        }}
                      >
                        {m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(' ')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-500" />
                    <span className="text-xs text-gray-400">Typing...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-[11px] text-center rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                ⚠️ Failed to send message. Make sure the API Key is installed 
              </div>
            )}
          </div>

          {/* Quick Options */}
          {messages.length === 0 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {[
                "How does Schedulin work?",
                "What are the pricing plans?",
                "Can I cancel my subscription?",
                "How do I set up a booking link?"
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setLocalInput(option);
                    // Trigger send if you want it immediate, but setting input is safer for UX first
                  }}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 text-[11px] rounded-full transition-all text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleFormSubmit} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
            <input
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Tanya sesuatu..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!localInput.trim() || isLoading}
              className="p-3 bg-brand-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all flex items-center justify-center shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
