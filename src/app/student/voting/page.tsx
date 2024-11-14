'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'

interface Poll {
  id: number
  title: string
  description: string
  options: { id: number; text: string; votes: number }[]
  totalVotes: number
  status: 'active' | 'closed'
  endDate: Date
}

const VotingPage: React.FC = () => {
  const router = useRouter()
  
  // Mock data for polls
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      title: "Hostel Mess Menu Changes",
      description: "Proposed changes to include more variety in breakfast options",
      options: [
        { id: 1, text: "Keep current menu", votes: 45 },
        { id: 2, text: "Add more options", votes: 120 },
        { id: 3, text: "Completely new menu", votes: 35 }
      ],
      totalVotes: 200,
      status: 'active',
      endDate: new Date('2024-03-25')
    },
    {
      id: 2,
      title: "Weekend Library Hours",
      description: "Proposal to extend library hours during weekends",
      options: [
        { id: 1, text: "Keep current hours", votes: 30 },
        { id: 2, text: "Extend by 2 hours", votes: 85 },
        { id: 3, text: "24/7 access", votes: 65 }
      ],
      totalVotes: 180,
      status: 'active',
      endDate: new Date('2024-03-23')
    }
  ])

  // Mock data for analytics
  const participationData = [
    { month: 'Jan', participation: 65 },
    { month: 'Feb', participation: 75 },
    { month: 'Mar', participation: 85 },
    { month: 'Apr', participation: 82 },
    { month: 'May', participation: 90 }
  ]

  const categoryData = [
    { category: 'Mess', votes: 450 },
    { category: 'Facilities', votes: 320 },
    { category: 'Events', votes: 280 },
    { category: 'Rules', votes: 220 },
    { category: 'Others', votes: 150 }
  ]

  const handleVote = (pollId: number, optionId: number) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 }
          }
          return opt
        })
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1
        }
      }
      return poll
    }))
  }

  return (
    <div className="min-h-screen bg-background text-white font-clash">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary-dark/20 to-background">
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
                Hostel Voting
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Have your say in hostel decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 space-y-8">
          {/* Active Polls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {polls.map(poll => (
              <Card key={poll.id} className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{poll.title}</h3>
                      <p className="text-gray-400">{poll.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20">
                      {poll.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {poll.options.map(option => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{option.text}</span>
                          <span>{Math.round((option.votes / poll.totalVotes) * 100)}%</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Progress value={(option.votes / poll.totalVotes) * 100} className="flex-grow" />
                          <Button 
                            size="sm"
                            onClick={() => handleVote(poll.id, option.id)}
                          >
                            Vote
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Total votes: {poll.totalVotes} • Ends: {poll.endDate.toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Participation Trends */}
            <Card className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Participation Trends</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={participationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #ffffff20' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="participation" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Distribution */}
            <Card className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Voting Categories</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="category" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #ffffff20' 
                      }} 
                    />
                    <Bar dataKey="votes" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VotingPage as unknown as React.ComponentType
