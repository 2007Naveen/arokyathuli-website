"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
}

const BOT_RESPONSES: Record<string, string> = {
  "water": "If you notice contaminated water, immediately report it through the 'Submit Report' section. Avoid using the water for drinking or cooking. Boil water before consumption as a precaution.",
  "symptoms": "Common waterborne disease symptoms include diarrhea, vomiting, fever, and abdominal pain. If you experience these, seek medical attention immediately and report via our system.",
  "report": "To submit a report: Go to 'Submit Report' in the navigation. Select the issue type, your location, and provide a detailed description. You'll receive a Reference ID for tracking.",
  "risk": "Risk levels are calculated using AI based on water contamination (35%), symptom spikes (25%), monsoon factor (20%), flood vulnerability (10%), and historical trends (10%).",
  "flood": "Flood-prone villages have lower alert thresholds. During floods, water sources are at higher contamination risk. Follow government advisories and use only treated water.",
  "contact": "Emergency Water Helpline: 1800-XXX-XXXX | District Health Office: health@district.gov.in | Email: support@sih25001.com",
  "monsoon": "During monsoon season, waterborne disease risk increases significantly. Pre-boil water, avoid stagnant water areas, and report any unusual water quality changes immediately.",
  "default": "I'm the Smart Health Monitor AI Assistant. I can help you with:\n- Water quality concerns\n- Symptom guidance\n- Report submission help\n- Risk level information\n- Flood safety tips\n- Emergency contacts\n\nHow can I assist you today?",
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return response
  }
  return BOT_RESPONSES.default
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "bot",
      content: "Hello! I'm the Smart Health Monitor AI Assistant. How can I help you today? Ask me about water safety, symptoms, reporting, or risk levels.",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    setTimeout(() => {
      const botMsg: Message = { id: `b-${Date.now()}`, role: "bot", content: getBotResponse(userMsg.content) }
      setMessages(prev => [...prev, botMsg])
    }, 600)
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
              <span className="text-sm font-bold text-primary-foreground">AI Health Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground hover:text-primary-foreground/80" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[250px] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-card-foreground"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01579B]">
                      <User className="h-4 w-4 text-[#ffffff]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border bg-card p-3">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask about water safety..."
              className="flex-1 text-sm"
            />
            <Button size="icon" onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-[#2E7D32]" aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
