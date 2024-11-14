'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const RatingsPage = () => {
  const [ratings, setRatings] = useState({
    roomCleanliness: 0,
    bathrooms: 0,
    foodQuality: 0,
    wifi: 0,
    security: 0,
    maintenance: 0,
    laundry: 0,
    commonAreas: 0,
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const facilities = [
    { id: 'roomCleanliness', label: 'Room Cleanliness' },
    { id: 'bathrooms', label: 'Bathroom Facilities' },
    { id: 'foodQuality', label: 'Mess/Cafeteria Food' },
    { id: 'wifi', label: 'Internet/WiFi' },
    { id: 'security', label: 'Security Services' },
    { id: 'maintenance', label: 'Maintenance Response' },
    { id: 'laundry', label: 'Laundry Services' },
    { id: 'commonAreas', label: 'Common Areas' },
  ]

  const handleRating = (facilityId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [facilityId]: rating
    }))
  }

  const handleSubmit = async () => {
    // TODO: Implement API call to save ratings
    console.log('Submitted ratings:', ratings)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background text-white font-clash">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/student/dashboard">
          <Button variant="ghost" className="text-white hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary-dark/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8 text-primary font-clash">
              Facility Ratings
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
              Rate our facilities and help us improve our services
            </p>
          </div>
        </div>
      </section>

      {/* Ratings Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility) => (
              <div key={facility.id} 
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold text-primary mb-6">{facility.label}</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(facility.id, star)}
                      className="focus:outline-none"
                    >
                      {star <= ratings[facility.id as keyof typeof ratings] ? (
                        <StarIcon className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <StarOutline className="h-8 w-8 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <textarea
              className="w-full bg-white/10 p-4 rounded-lg border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Additional comments or suggestions..."
            />
            
            <Button 
              onClick={handleSubmit}
              className="mt-4 bg-primary hover:bg-primary/90 text-black font-medium"
            >
              Submit Ratings
            </Button>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 backdrop-blur-md bg-green-500/20 p-4 rounded-xl shadow-lg border border-green-500/20 text-white animate-fade-in">
          <p className="flex items-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            Ratings submitted successfully!
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-muted/50 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Student Hostel Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default RatingsPage
