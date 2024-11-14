'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  content: string
  timestamp: Date
  author: string
}

const dummyAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Maintenance Schedule',
    content: 'The water supply will be interrupted on Sunday from 10 AM to 2 PM due to routine maintenance.',
    timestamp: new Date('2024-03-20'),
    author: 'Hostel Maintenance'
  },
  {
    id: '2',
    title: 'Hostel Day Celebration',
    content: 'Annual Hostel Day celebrations will be held on March 25th. All students are requested to participate.',
    timestamp: new Date('2024-03-15'),
    author: 'Hostel Warden'
  },
  {
    id: '3',
    title: 'New Mess Menu',
    content: 'Updated mess menu for the month of March is now available. Please check the notice board.',
    timestamp: new Date('2024-03-10'),
    author: 'Mess Committee'
  }
]

export default function AnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(dummyAnnouncements)
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 text-gray-400 hover:text-white"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Announcements</h1>
        <p className="text-gray-400 mt-2">Stay updated with the latest hostel announcements</p>
      </div>

      <div className="space-y-6">
        {announcements.length === 0 ? (
          <Card className="bg-black/10 backdrop-blur-lg border border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-white text-lg">No announcements available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className="bg-black/10 backdrop-blur-lg border border-white/10 hover:bg-black/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">{announcement.title}</h2>
                  <span className="text-sm text-gray-400">
                    {announcement.timestamp.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <p className="text-white text-lg mb-4 leading-relaxed">
                  {announcement.content}
                </p>

                <div className="text-sm text-gray-400 flex items-center">
                  <span className="font-medium">Posted by:</span>
                  <span className="ml-2 text-gray-300">{announcement.author}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
