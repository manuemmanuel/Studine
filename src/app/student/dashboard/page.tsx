"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ProfileMenu } from "@/components/profile-menu"
import { 
  Calendar, Bell, FileText, ClipboardList, Users, 
  Utensils, PenTool, MessageCircle, Vote, Star, 
  CreditCard, BookOpen, Coffee, Bed, Mail, Phone 
} from 'lucide-react'
import { useState, useEffect } from 'react'

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}
        />
      ))}
    </div>
  )
}

export default function StudentDashboard() {
  const stats = [
    { title: "Attendance Rate", value: "92%", description: "Current semester", icon: BookOpen },
    { title: "Meal Credits", value: "28", description: "Remaining this month", icon: Coffee },
    { title: "Room Number", value: "A-204", description: "Second Floor", icon: Bed },
    { title: "Due Payments", value: "₹0", description: "All bills cleared", icon: CreditCard },
  ]

  const navigationItems = [
    { 
      title: "Weekly Menu & Food Booking", 
      icon: Calendar, 
      href: "./menu",
      description: "View and book your meals for the week"
    },
    { 
      title: "Announcements", 
      icon: Bell, 
      href: "./announcements",
      description: "Stay updated with latest hostel news"
    },
    { 
      title: "Attendance Details", 
      icon: FileText, 
      href: "./attendance",
      description: "Check your attendance records"
    },
    { 
      title: "Complaint Register", 
      icon: ClipboardList, 
      href: "./complaints",
      description: "Register maintenance issues"
    },
    { 
      title: "Movement Register", 
      icon: Users, 
      href: "./movement",
      description: "Log your entry/exit times"
    },
    { 
      title: "Food Booking", 
      icon: Utensils, 
      href: "./food-booking",
      description: "Book or cancel your meals"
    },
    { 
      title: "Menu Suggestions", 
      icon: PenTool, 
      href: "./menu-suggestions",
      description: "Suggest improvements to the menu"
    },
    { 
      title: "Student Forum", 
      icon: MessageCircle, 
      href: "./forum",
      description: "Connect with other residents"
    },
    { 
      title: "Hostel Voting", 
      icon: Vote, 
      href: "./voting",
      description: "Participate in hostel decisions"
    },
    { 
      title: "Facility Ratings", 
      icon: Star, 
      href: "./ratings",
      description: "Rate hostel facilities"
    },
    { 
      title: "Payments", 
      icon: CreditCard, 
      href: "./payments",
      description: "Manage your payments"
    },
  ]

  const timelineItems = [
    { id: 'hero', label: 'Welcome' },
    { id: 'stats', label: 'Statistics' },
    { id: 'about', label: 'About' },
    { id: 'quick-access', label: 'Quick Access' },
    { id: 'contact', label: 'Contact' },
  ]

  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-white font-clash relative">
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-8 relative">
          <div className="absolute left-1 top-0 bottom-0 w-[1px] bg-white/20" />
          <div 
            className="absolute left-1 top-0 w-[1px] bg-primary transition-all duration-300"
            style={{ 
              height: `${((timelineItems.findIndex(item => item.id === activeSection) + 1) / timelineItems.length) * 100}%`
            }}
          />
          {timelineItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center gap-3 group transition-all ${
                activeSection === item.id ? 'text-primary' : 'text-white/50 hover:text-white'
              }`}
            >
              <div className={`w-2 h-2 rounded-full transition-all relative z-10 ${
                activeSection === item.id 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/50 group-hover:bg-white'
              }`} />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
      <section id="hero" className="relative py-24 bg-gradient-to-b from-primary-dark/20 to-background overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 text-primary font-clash inline-flex items-center gap-4">
                Welcome back, John!
                <div className="ml-4">
                  <ProfileMenu />
                </div>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Here's what's happening with your hostel today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="relative z-10 -mt-16 mb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg backdrop-blur-sm">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white/80">{stat.title}</h3>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-background-light">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary font-clash">
            About Your Hostel
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Users, title: "Community Living", desc: "Join a vibrant community of 500+ students from diverse backgrounds" },
              { icon: Utensils, title: "Quality Dining", desc: "Enjoy nutritious meals prepared in our modern kitchen facilities" },
              { icon: Star, title: "Premium Facilities", desc: "Access to study rooms, gym, and recreational areas" }
            ].map((item, index) => (
              <div key={index} className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20 text-center">
                <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quick-access" className="py-24 bg-gradient-to-b from-background to-background-light">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Quick Access
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {navigationItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-white/20 group"
              >
                <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm group-hover:bg-primary/30 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white/90">{item.title}</h3>
                <p className="text-sm text-white/70">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <h2 className="text-3xl font-bold mb-8 text-primary">Get in Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: MessageCircle, title: "Chat Support", desc: "Available 24/7" },
                  { icon: Mail, title: "Email Us", desc: "support@hostel.com" },
                  { icon: Phone, title: "Phone", desc: "+1 (555) 123-4567" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <item.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <h2 className="text-3xl font-bold mb-8 text-primary">Emergency Contacts</h2>
              <div className="space-y-6">
                {[
                  { title: "Warden", phone: "+1 (555) 234-5678" },
                  { title: "Security Office", phone: "+1 (555) 345-6789" },
                  { title: "Medical Emergency", phone: "+1 (555) 456-7890" }
                ].map((contact, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-medium">{contact.title}</h3>
                    <p className="text-primary">{contact.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Student Hostel Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}