"use client";

import { Box, Container } from "@mui/material";
import {
  Home, Person, Build, Report, Announcement, PersonAdd,
  CreditCard, Coffee, Bed, RestaurantMenu, BookOnline, 
  Campaign, HowToReg, ReportProblem, DirectionsWalk, 
  PersonSearch, HowToVote, Payments, Info
} from "@mui/icons-material";
import Link from 'next/link';
import { ProfileMenu } from "@/components/profile-menu";
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

const timelineItems = [
  { id: 'hero', label: 'Welcome' },
  { id: 'stats', label: 'Statistics' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'quick-access', label: 'Quick Access' }
]

const ratingCategories = [
  { name: "Food Quality", rating: 4.2, responses: 156 },
  { name: "Cleanliness", rating: 4.5, responses: 178 },
  { name: "Maintenance", rating: 3.8, responses: 143 },
  { name: "Staff Behavior", rating: 4.7, responses: 165 },
  { name: "Security", rating: 4.6, responses: 170 },
  { name: "Internet", rating: 3.9, responses: 182 }
];

const calculateHostelGrade = (ratings: { rating: number; responses: number }[]) => {
  const totalResponses = ratings.reduce((acc: number, cat) => acc + cat.responses, 0);
  const weightedSum = ratings.reduce((acc: number, cat) => {
    return acc + (cat.rating * cat.responses);
  }, 0);
  const averageRating = weightedSum / totalResponses;
  
  if (averageRating >= 4.5) return 'A+';
  if (averageRating >= 4.0) return 'A';
  if (averageRating >= 3.5) return 'B+';
  if (averageRating >= 3.0) return 'B';
  if (averageRating >= 2.5) return 'C';
  return 'D';
};

export default function ManagementDashboard() {
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

  const stats = [
    { title: "Total Rooms", value: "250", description: "Currently Active", icon: Home },
    { title: "Occupancy Rate", value: "92%", description: "Current semester", icon: Person },
    { title: "Pending Requests", value: "12", description: "Maintenance & Complaints", icon: Build },
    { title: "Due Payments", value: "₹25,000", description: "Outstanding bills", icon: CreditCard },
  ];

  const navigationItems = [
    { 
      title: "Room Management",
      icon: Home,
      href: "./rooms",
      description: "Manage rooms and allocations"
    },
    {
      title: "Food Menu Management",
      icon: RestaurantMenu,
      href: "./food-menu",
      description: "View and edit the food menu"
    },
    {
      title: "Food Booking Dashboard",
      icon: BookOnline,
      href: "./food-booking",
      description: "View resident food booking statistics"
    },
    {
      title: "Public Announcements",
      icon: Campaign,
      href: "./announcements",
      description: "Create and publish announcements"
    },
    {
      title: "Attendance Management",
      icon: HowToReg,
      href: "./attendance",
      description: "Mark and track resident attendance"
    },
    {
      title: "Complaints Management",
      icon: ReportProblem,
      href: "./complaints",
      description: "Handle and resolve resident complaints"
    },
    {
      title: "Movement Register",
      icon: DirectionsWalk,
      href: "./movement",
      description: "Track resident movement logs"
    },
    {
      title: "Resident Details",
      icon: PersonSearch,
      href: "/management/residents",
      description: "View and search resident profiles"
    },
    {
      title: "Voting & Polling",
      icon: HowToVote,
      href: "/management/voting",
      description: "Manage polls and view results"
    },
    {
      title: "Payment Management",
      icon: Payments,
      href: "/management/payments",
      description: "Manage payment categories and amounts"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash relative">
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

      <section id="hero" className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40] overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 text-primary font-clash inline-flex items-center gap-4">
                Management Dashboard
                <div className="ml-4">
                  <ProfileMenu />
                </div>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Monitor and manage all hostel operations from here.
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

      <section id="ratings" className="py-24 bg-gradient-to-b from-[#0A4A40] to-[#083830]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Resident Satisfaction Overview
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20 flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-4 text-white/90">Overall Grade</h3>
              <div className="text-8xl font-bold text-primary mb-4">
                {calculateHostelGrade(ratingCategories)}
              </div>
              <p className="text-white/70 text-center">
                Based on {ratingCategories.reduce((acc, cat) => acc + cat.responses, 0)} total responses
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-white/90">Category Breakdown</h3>
              <div className="space-y-4">
                {ratingCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/90">{category.name}</span>
                      <span className="text-primary font-semibold">{category.rating.toFixed(1)}/5.0</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(category.rating / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/60">{category.responses} responses</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-lg border border-white/20">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-semibold text-white/90">Grade Calculation</h3>
              </div>
              <div className="space-y-4 text-white/70">
                <p>The hostel grade is calculated using a weighted average system that considers:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Individual category ratings (1-5 scale)</li>
                  <li>Number of responses per category</li>
                  <li>Total response distribution</li>
                </ul>
                <div className="mt-6 space-y-2">
                  <p className="font-semibold text-primary">Grade Scale:</p>
                  <ul className="space-y-1 text-sm">
                    <li>A+ : ≥ 4.5</li>
                    <li>A  : ≥ 4.0</li>
                    <li>B+ : ≥ 3.5</li>
                    <li>B  : ≥ 3.0</li>
                    <li>C  : ≥ 2.5</li>
                    <li>D  : &lt; 2.5</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quick-access" className="py-24 bg-gradient-to-b from-[#0A4A40] to-[#083830]">
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

      <footer className="bg-black/20 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/management/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
                <li><Link href="/management/settings" className="hover:text-primary transition-colors">Settings</Link></li>
                <li><Link href="/management/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">Contact</h3>
              <ul className="space-y-2 text-white/70">
                <li>Emergency: +91 1234567890</li>
                <li>Email: support@hostelhub.com</li>
                <li>Location: Campus Area, Main Building</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">System Status</h3>
              <div className="flex items-center gap-2 text-white/70">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>All systems operational</span>
              </div>
              <p className="text-white/50 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50">
            <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
