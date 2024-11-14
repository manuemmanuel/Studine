'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'

const MovementRegisterPage: React.FC = () => {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    // Here you would typically also handle the form data submission
    setTimeout(() => setShowSuccess(false), 3000) // Hide after 3 seconds
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
                Movement Register
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Record your hostel exit and return details
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {showSuccess && (
            <Card className="mb-6 p-4 bg-green-500/20 border-green-500/50 text-center">
              Movement record submitted successfully! ✨
            </Card>
          )}
          
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    placeholder="Where are you going?"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Input 
                    id="purpose" 
                    placeholder="Why are you going?"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure">Departure Date & Time</Label>
                  <Input 
                    id="departure" 
                    type="datetime-local"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return">Expected Return Date & Time</Label>
                  <Input 
                    id="return" 
                    type="datetime-local"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contact">Emergency Contact</Label>
                  <Input 
                    id="contact" 
                    placeholder="Phone number while away"
                    className="bg-white/5"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address While Away</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Enter the address of your destination"
                    className="bg-white/5"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  Submit Movement Record
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default MovementRegisterPage as unknown as React.ComponentType
