"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react"

const transport = new DefaultChatTransport({ api: "/api/chat" })

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({ transport })

  const isLoading = status === "streaming" || status === "submitted"

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          aria-label="Open AI chat assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <div>
                <span className="text-sm font-bold text-primary-foreground">AI Health Assistant</span>
                <span className="ml-2 text-[10px] text-primary-foreground/70">Gemini</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground hover:text-primary-foreground/80" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              {/* Welcome message if no messages yet */}
              {messages.length === 0 && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="max-w-[250px] rounded-lg bg-muted px-3 py-2 text-sm text-card-foreground">
                    {"Hello! I'm the Smart Health Monitor AI Assistant powered by Gemini. Ask me about water safety, symptoms, reporting, risk levels, or flood safety tips."}
                  </div>
                </div>
              )}

              {messages.map(msg => {
                const text = msg.parts
                  ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map(p => p.text)
                  .join("") || ""

                if (!text) return null

                return (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[250px] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-card-foreground"
                    }`}>
                      {text}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01579B]">
                        <User className="h-4 w-4 text-[#ffffff]" />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Loading indicator */}
              {isLoading && messages.length > 0 && (() => {
                const lastMsg = messages[messages.length - 1]
                const lastText = lastMsg?.parts
                  ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map(p => p.text)
                  .join("") || ""
                if (lastMsg?.role === "user" || !lastText) {
                  return (
                    <div className="flex gap-2 justify-start">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>

          {/* Quick prompts */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1 border-t border-border bg-muted/50 px-3 py-2">
              {["Water safety tips", "Report contamination", "Risk levels explained", "Monsoon precautions"].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    sendMessage({ text: prompt })
                  }}
                  className="rounded-full border border-border bg-card px-2 py-1 text-[11px] text-card-foreground transition-colors hover:bg-secondary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-card p-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about water safety..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={handleSend}
              className="bg-primary text-primary-foreground hover:bg-[#2E7D32]"
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
