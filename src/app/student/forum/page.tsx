'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react'

interface Message {
  id: number
  user: string
  avatar: string
  message: string
  timestamp: Date
  isCurrentUser: boolean
}

const ForumPage: React.FC = () => {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Alex Kumar",
      avatar: "/avatars/alex.jpg",
      message: "Anyone up for basketball this evening?",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false
    },
    {
      id: 2,
      user: "Priya Singh",
      avatar: "/avatars/priya.jpg",
      message: "I'm in! What time?",
      timestamp: new Date(Date.now() - 3000000),
      isCurrentUser: false
    },
    {
      id: 3,
      user: "John Doe",
      avatar: "/avatars/rahul.jpg",
      message: "Count me in too! 6 PM works?",
      timestamp: new Date(Date.now() - 2400000),
      isCurrentUser: true
    },
    {
      id: 4,
      user: "Sarah Wilson",
      avatar: "/avatars/sarah.jpg",
      message: "Has anyone seen my blue water bottle? I think I left it in the common room",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false
    },
    {
      id: 5,
      user: "Alex Kumar",
      avatar: "/avatars/alex.jpg",
      message: "6 PM sounds perfect! See you all at the court 🏀",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: false
    }
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        user: "John Doe",
        avatar: "/avatars/rahul.jpg",
        message: newMessage,
        timestamp: new Date(),
        isCurrentUser: true
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-background text-white font-clash">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-primary-dark/20 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between relative">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="absolute left-4 top-0"
            >
              ← Back
            </Button>
            <div className="text-center w-full">
              <h1 className="text-5xl font-bold mb-4 text-primary font-clash">
                Hostel Forum
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Connect with your fellow residents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 h-[600px] flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-grow mb-4 pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.isCurrentUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${
                      msg.isCurrentUser ? 'items-end' : ''
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{msg.user}</span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className={`mt-1 rounded-lg p-3 max-w-md ${
                        msg.isCurrentUser 
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-white/5 text-white placeholder:text-gray-400"
              />
              <Button type="submit">Send</Button>
            </form>
          </Card>

          {/* Online Users Card */}
          <Card className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 mt-6">
            <h2 className="text-lg font-semibold mb-4">Online Now</h2>
            <div className="flex gap-2">
              {messages.map((msg) => (
                <Avatar key={msg.id}>
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback>{msg.user[0]}</AvatarFallback>
                </Avatar>
              )).slice(0, 5)}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                <span className="text-sm">+12</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default ForumPage as unknown as React.ComponentType 