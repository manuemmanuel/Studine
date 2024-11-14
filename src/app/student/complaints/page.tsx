'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

// Add proper type definition for the component
const ComplaintsPage: React.FC = () => {
  const router = useRouter()
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      category: 'Maintenance',
      subject: 'Broken Fan',
      description: 'The ceiling fan in room 203 is not working properly',
      status: 'Pending',
      date: '2024-03-20',
    },
    // Add more sample complaints as needed
  ])

  const [newComplaint, setNewComplaint] = useState({
    category: '',
    subject: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add logic to submit complaint to backend
    const complaint = {
      id: complaints.length + 1,
      ...newComplaint,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    }
    setComplaints([complaint, ...complaints])
    setNewComplaint({ category: '', subject: '', description: '' })
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
                Complaint Register
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Register and track your maintenance issues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
            {/* Submit Complaint Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>
                  Please provide details about your complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    onValueChange={(value) =>
                      setNewComplaint({ ...newComplaint, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="food">Food Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Subject"
                    value={newComplaint.subject}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, subject: e.target.value })
                    }
                    required
                  />

                  <Textarea
                    placeholder="Describe your complaint in detail"
                    value={newComplaint.description}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, description: e.target.value })
                    }
                    required
                    className="min-h-[100px]"
                  />

                  <Button type="submit">Submit Complaint</Button>
                </form>
              </CardContent>
            </Card>

            {/* Complaints List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Complaints</h2>
              {complaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          complaint.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <CardDescription>
                      Category: {complaint.category} | Date: {complaint.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{complaint.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Make sure to use a named export
export default ComplaintsPage as unknown as React.ComponentType
