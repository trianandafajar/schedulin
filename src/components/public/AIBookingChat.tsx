"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare, Send, X, Bot, Loader2, User, Sparkles,
  ChevronDown, CheckCircle2, Clock, Scissors, Calendar,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Service } from "@/actions/public";

function InteractiveOptionButton({ option, onSelect, disabled }: { option: any; onSelect: (action: string, label: string, value?: string) => void, disabled?: boolean }) {
  const [isInputMode, setIsInputMode] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (isInputMode) {
    return (
      <div className="flex items-center gap-2 w-full mt-1 mb-1">
        <input 
          autoFocus
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() && !disabled) {
              onSelect(option.action, option.label, inputValue);
            }
          }}
          disabled={disabled}
          className="flex-1 rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder={option.label}
        />
        <button 
          onClick={() => {
             if (inputValue.trim() && !disabled) {
               onSelect(option.action, option.label, inputValue);
             }
          }}
          disabled={!inputValue.trim() || disabled}
          className="rounded-xl bg-brand-500 hover:bg-brand-600 px-3 py-2.5 text-white disabled:bg-gray-300 transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (option.requiresInput === "text") {
          setIsInputMode(true);
        } else {
          onSelect(option.action, option.label);
        }
      }}
      disabled={disabled}
      className={`w-full text-left rounded-xl border border-brand-500 bg-white px-4 py-2.5 text-sm text-brand-500 font-medium transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-50 hover:border-brand-600 hover:text-brand-600"}`}
    >
      {option.label}
    </button>
  );
}

interface AIBookingChatProps {
  businessId: string;
  businessName: string;
  services: Service[];
  onSelectService?: (service: Service) => void;
  onSelectDateTimeAndOpenModal?: (date: string, time: string) => void;
}

const QUICK_PROMPTS = [
  "Start booking appointment",
];

export default function AIBookingChat({
  businessId,
  businessName,
  services,
  onSelectService,
  onSelectDateTimeAndOpenModal,
}: AIBookingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/booking-ai?businessId=${businessId}`,
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewMessage(false);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
    console.log("Current messages in UI:", messages);
    if (!isOpen && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") setHasNewMessage(true);
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    const text = localInput;
    setLocalInput("");
    try {
      await sendMessage({ text });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (isLoading) return;
    try {
      await sendMessage({ text: prompt });
    } catch (err) {
      console.error("Failed to send quick prompt:", err);
    }
  };

  const handleServiceSelect = useCallback(
    (serviceId: string, serviceName: string, price: number) => {
      // Logic handled by AI now, fallback if needed
    },
    []
  );

  const handleSlotSelect = useCallback(
    (date: string, slot: string) => {
      // Logic handled by AI now
    },
    []
  );

  const getMessageText = (m: any): string => {
    let textStr = "";
    if (m.parts && m.parts.length > 0) {
      textStr = m.parts
        .filter((p: any) => p.type === "text" || p.type === "text-delta")
        .map((p: any) => p.text || p.delta || "")
        .join(""); // Use empty string to avoid extra spaces
    }
    return textStr.trim() || m.content || m.text || "";
  };

  const getToolInvocations = (m: any): any[] => {
    if (m.parts) {
      return m.parts
        .filter((p: any) => p.type === "tool-invocation" || (typeof p.type === "string" && p.type.startsWith("tool-")))
        .map((p: any) => p.toolInvocation || p);
    }
    return m.toolInvocations || [];
  };

  const hasToolInvocations = (m: any): boolean => {
    return getToolInvocations(m).length > 0;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="flex h-[580px] w-[370px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl sm:w-[420px]"
          style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-white bg-brand-500">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">asas Assistant</h3>
                <p className="text-xs text-white/75">Powered by AI · Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 transition hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
            {/* Welcome State */}
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center gap-4 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">Hi, I'm asas Assistant!</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    I can help you book an appointment at <strong>{businessName}</strong>.<br />
                    Just ask me anything or pick a prompt below.
                  </p>
                </div>
                {/* Quick prompts */}
                <div className="flex flex-col gap-2 w-full">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleQuickPrompt(p)}
                      className="rounded-2xl border border-brand-500 bg-brand-500 hover:bg-brand-600 px-4 py-3 text-sm text-white font-bold transition-all text-center"
                    >
                      Start Booking Now
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message List */}
            {messages.map((m: any, i: number) => {
              const text = getMessageText(m);
              const invocations = getToolInvocations(m);

              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[90%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                        m.role === "user"
                          ? "bg-brand-500"
                          : "bg-gray-700"
                      }`}
                    >
                      {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Text bubble */}
                      {text && (
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-brand-500 text-white rounded-tr-none"
                              : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-none"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none prose-p:my-0">
                            <ReactMarkdown>{text}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Tool cards */}
                      {invocations.map((inv: any, j: number) => {
                        const toolName = inv.toolName || inv.tool_name || (inv.type?.startsWith('tool-') ? inv.type.replace('tool-', '') : '');
                        const isPartial = inv.state === 'partial-call';
                        let args = inv.args || inv.input || {};
                        if (typeof args === 'string') {
                          try {
                            args = JSON.parse(args);
                          } catch (e) {
                            args = {};
                          }
                        }
                        const key = inv.toolCallId || `${i}-${j}`;

                        const isLastMessage = i === messages.length - 1;
                        const disabled = !isLastMessage || isLoading; // Disable buttons on older messages

                        if (toolName === "interactiveOptions") {
                          if (isPartial) {
                            return (
                              <div key={key} className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-center animate-pulse shadow-sm">
                                <Loader2 className="w-4 h-4 text-brand-500 animate-spin mr-2" />
                                <span className="text-xs font-medium text-gray-500">Preparing options...</span>
                              </div>
                            );
                          }
                          return (
                            <div key={key} className="flex flex-col gap-3 w-full">
                              {args.message && (
                                <div className="text-sm text-gray-800 bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm leading-relaxed">
                                  <ReactMarkdown>{args.message}</ReactMarkdown>
                                </div>
                              )}
                              <div className="flex flex-col gap-2 w-full">
                                {(args.options || []).map((opt: any, optIdx: number) => {
                                  return (
                                    <InteractiveOptionButton 
                                      key={optIdx} 
                                      option={opt} 
                                      disabled={disabled}
                                      onSelect={(action, label, inputValue) => {
                                        if (action === "close") {
                                          setIsOpen(false);
                                        } else if (action === "restart") {
                                          window.location.reload();
                                        } else {
                                          sendMessage({ text: inputValue || label });
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        if (toolName === "submitBooking") {
                          if (isPartial) {
                            return (
                              <div key={key} className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-center animate-pulse shadow-sm">
                                <Loader2 className="w-4 h-4 text-brand-500 animate-spin mr-2" />
                                <span className="text-xs font-medium text-gray-500">Processing your booking...</span>
                              </div>
                            );
                          }
                          
                          const result = inv.result;
                          if (result) {
                            if (result.success) {
                              return (
                                <div key={key} className="p-4 rounded-2xl border border-success-200 bg-success-50 flex flex-col gap-3 shadow-sm mt-2">
                                  <div className="flex items-center gap-2 text-success-700 font-bold">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Booking Successful!</span>
                                  </div>
                                  <p className="text-sm text-success-800">
                                    Booking Code: <strong>{result.bookingId}</strong><br/>
                                    Details have been saved. Thank you!
                                  </p>
                                  <div className="flex gap-2 mt-1">
                                    <button 
                                      onClick={() => window.location.reload()} 
                                      className="px-3 py-2 bg-success-600 hover:bg-success-700 transition-colors text-white text-xs font-bold rounded-xl flex-1"
                                    >
                                      Book Again
                                    </button>
                                    <button 
                                      onClick={() => setIsOpen(false)} 
                                      className="px-3 py-2 bg-white hover:bg-success-100 transition-colors text-success-700 border border-success-200 text-xs font-bold rounded-xl flex-1"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div key={key} className="p-4 rounded-2xl border border-error-200 bg-error-50 flex flex-col gap-2 shadow-sm mt-2">
                                  <div className="flex items-center gap-2 text-error-700 font-bold">
                                    <X className="w-5 h-5" />
                                    <span>Booking Failed</span>
                                  </div>
                                  <p className="text-sm text-error-600">{result.error || "A system error occurred."}</p>
                                </div>
                              );
                            }
                          }
                          return null;
                        }

                        return null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-2.5 bg-error-50 text-error-500 text-xs text-center rounded-xl border border-error-100">
                ⚠️ Connection error. Please try again.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Padding at the bottom for scroll */}
          <div className="h-4 bg-gray-50/40 w-full shrink-0" />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setIsOpen((o) => !o); setHasNewMessage(false); }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 hover:bg-brand-600 text-white transition-all hover:scale-110 active:scale-95"
        aria-label="Open asas Assistant"
      >
        {isOpen ? <ChevronDown className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error-500 border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
