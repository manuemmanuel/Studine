'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MenuSuggestionsPage: React.FC = () => {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [suggestions, setSuggestions] = useState([
    { id: 1, suggestion: 'Add more variety of fruits', status: 'Under Review', votes: 15, hasVoted: false },
    { id: 2, suggestion: 'Include pasta in dinner menu', status: 'Approved', votes: 23, hasVoted: false },
    { id: 3, suggestion: 'Provide more salad options', status: 'Implemented', votes: 45, hasVoted: false }
  ])

  const handleVote = (id: number) => {
    setSuggestions(prevSuggestions => 
      prevSuggestions.map(suggestion => 
        suggestion.id === id && !suggestion.hasVoted
          ? { ...suggestion, votes: suggestion.votes + 1, hasVoted: true }
          : suggestion
      )
    )
  }

  // Mock data - replace with API data
  const currentMenu = {
    breakfast: ['Idli', 'Dosa', 'Upma', 'Bread & Jam'],
    lunch: ['Rice', 'Dal', 'Vegetables', 'Curd'],
    dinner: ['Chapati', 'Rice', 'Curry', 'Soup']
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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
                Menu Suggestions
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Help us improve the hostel menu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 space-y-8">
          {showSuccess && (
            <Card className="mb-6 p-4 bg-green-500/20 border-green-500/50 text-center">
              Your suggestion has been submitted successfully! ✨
            </Card>
          )}

          {/* Current Menu Card */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Current Menu</h2>
            <Tabs defaultValue="breakfast">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
              </TabsList>
              {Object.entries(currentMenu).map(([meal, items]) => (
                <TabsContent key={meal} value={meal}>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          {/* Suggestion Form */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Make a Suggestion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea 
                placeholder="Share your ideas for improving the menu..."
                className="bg-white/5 min-h-[100px]"
              />
              <Button type="submit" className="w-full md:w-auto">
                Submit Suggestion
              </Button>
            </form>
          </Card>

          {/* Recent Suggestions */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Recent Suggestions</h2>
            <div className="space-y-4">
              {suggestions.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="space-y-2">
                    <p>{item.suggestion}</p>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline"
                        className={
                          item.status === 'Implemented' ? 'bg-green-500/20' :
                          item.status === 'Approved' ? 'bg-blue-500/20' :
                          'bg-yellow-500/20'
                        }
                      >
                        {item.status}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {item.votes} votes
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleVote(item.id)}
                    disabled={item.hasVoted}
                    className={item.hasVoted ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {item.hasVoted ? '✓ Voted' : '👍 Vote'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Tips for Good Suggestions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Consider nutritional balance in your suggestions</li>
              <li>Think about feasibility and cost-effectiveness</li>
              <li>Suggest items that can be prepared in large quantities</li>
              <li>Consider dietary restrictions and preferences</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default MenuSuggestionsPage as unknown as React.ComponentType
