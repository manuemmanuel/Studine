'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState } from 'react'
import { addDays, isBefore, startOfToday } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { QRCodeSVG } from 'qrcode.react'

const FoodBookingPage: React.FC = () => {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showSuccess, setShowSuccess] = useState(false)
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  })

  // Calculate the minimum allowed booking date (2 days from today)
  const minBookingDate = addDays(startOfToday(), 2)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && Object.values(meals).some(meal => meal)) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      // Reset form
      setSelectedDate(undefined)
      setMeals({ breakfast: false, lunch: false, dinner: false })
    }
  }

  // Mock data for booked meals - replace with actual API data
  const bookedMeals = [
    { 
      date: '2024-03-20', 
      meals: ['Breakfast', 'Dinner'],
      status: 'Upcoming'
    },
    { 
      date: '2024-03-21', 
      meals: ['Lunch'],
      status: 'Upcoming'
    },
    { 
      date: '2024-03-22', 
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      status: 'Upcoming'
    },
  ]

  // Mock data for today's meals - replace with actual API data
  const todaysMeals = {
    date: new Date().toISOString(),
    meals: ['Breakfast', 'Lunch'],
    qrCode: 'MEAL-2024-03-19-001' // This would be your actual meal token
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
                Food Booking
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Book your meals in advance
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
              Meals booked successfully! ✨
            </Card>
          )}

          {/* Today's QR Code Card */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG 
                  value={todaysMeals.qrCode}
                  size={200}
                  level="H"
                />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-2xl font-semibold">Today's Meal QR Code</h2>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex gap-2 justify-center md:justify-start">
                    {todaysMeals.meals.map((meal, index) => (
                      <Badge key={index} variant="secondary">
                        {meal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Show this QR code at the dining hall to mark your attendance
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => isBefore(date, minBookingDate)}
                className="bg-white/5 rounded-lg p-3"
              />
              <p className="text-sm text-gray-400 mt-2">
                * You can only book meals for dates at least 2 days in advance
              </p>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select Meals</h2>
                  {selectedDate && (
                    <Badge className="mb-4">
                      Selected: {selectedDate.toLocaleDateString()}
                    </Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="breakfast"
                        checked={meals.breakfast}
                        onCheckedChange={(checked) => 
                          setMeals(prev => ({...prev, breakfast: checked === true}))
                        }
                      />
                      <Label htmlFor="breakfast">Breakfast (7:30 AM - 9:00 AM)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="lunch"
                        checked={meals.lunch}
                        onCheckedChange={(checked) => 
                          setMeals(prev => ({...prev, lunch: checked === true}))
                        }
                      />
                      <Label htmlFor="lunch">Lunch (12:30 PM - 2:00 PM)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dinner"
                        checked={meals.dinner}
                        onCheckedChange={(checked) => 
                          setMeals(prev => ({...prev, dinner: checked === true}))
                        }
                      />
                      <Label htmlFor="dinner">Dinner (7:30 PM - 9:00 PM)</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!selectedDate || !Object.values(meals).some(meal => meal)}
                >
                  Book Meals
                </Button>
              </form>
            </Card>
          </div>

          {/* Booked Meals Section */}
          <Card className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Your Booked Meals</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead>Date</TableHead>
                    <TableHead>Meals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookedMeals.map((booking, index) => (
                    <TableRow key={index} className="border-white/20">
                      <TableCell>
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.meals.map((meal, i) => (
                            <Badge key={i} variant="secondary">
                              {meal}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/20">
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30"
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default FoodBookingPage as unknown as React.ComponentType
