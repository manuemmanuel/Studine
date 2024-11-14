"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from "@mui/material";
import { ReportProblem, CheckCircle, PriorityHigh, Warning, Info, ArrowBack } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";

// Mock data - replace with actual data from your backend
const initialComplaints = [
  {
    id: 1,
    title: "Water Leakage in Room 203",
    description: "There's a constant water drip from the ceiling near the window.",
    priority: "high",
    status: "pending",
    submittedBy: "John Doe",
    roomNumber: "203",
    submittedAt: "2024-03-15T10:30:00",
    category: "maintenance"
  },
  {
    id: 2,
    title: "Noisy Neighbors in Room 305",
    description: "Constant loud music and parties after quiet hours.",
    priority: "medium",
    status: "pending",
    submittedBy: "Sarah Smith",
    roomNumber: "304",
    submittedAt: "2024-03-16T15:45:00",
    category: "noise"
  },
  {
    id: 3,
    title: "Broken AC Unit",
    description: "Air conditioning not working for the past 2 days. Room is too hot.",
    priority: "high",
    status: "resolved",
    submittedBy: "Mike Johnson",
    roomNumber: "405",
    submittedAt: "2024-03-14T09:15:00",
    category: "maintenance"
  },
  {
    id: 4,
    title: "Parking Space Issue",
    description: "Someone keeps parking in my assigned spot #B45.",
    priority: "low",
    status: "pending",
    submittedBy: "Emma Wilson",
    roomNumber: "112",
    submittedAt: "2024-03-16T11:20:00",
    category: "parking"
  },
  {
    id: 5,
    title: "Pest Control Needed",
    description: "Spotted cockroaches in the kitchen area.",
    priority: "high",
    status: "pending",
    submittedBy: "David Brown",
    roomNumber: "506",
    submittedAt: "2024-03-15T16:30:00",
    category: "pest control"
  }
];

const priorityIcons = {
  high: <PriorityHigh className="text-red-500" />,
  medium: <Warning className="text-yellow-500" />,
  low: <Info className="text-blue-500" />
};

export default function ComplaintsManagement() {
  const router = useRouter();
  const [complaints, setComplaints] = useState(initialComplaints);

  const handleResolveComplaint = (id: number) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status: 'resolved' } : complaint
    ));
  };

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash">
      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40]">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="absolute left-4 top-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowBack /> Back
          </button>
          
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 text-primary font-clash inline-flex items-center gap-4">
                Complaints Management
                <div className="ml-4">
                  <ProfileMenu />
                </div>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Track and resolve resident complaints efficiently
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 
                  ${complaint.status === 'resolved' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {priorityIcons[complaint.priority as keyof typeof priorityIcons]}
                      <h3 className="text-xl font-semibold text-white/90">{complaint.title}</h3>
                    </div>
                    <p className="text-white/70 mb-4">{complaint.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                      <div>
                        <span className="block text-white/40">Submitted By</span>
                        {complaint.submittedBy}
                      </div>
                      <div>
                        <span className="block text-white/40">Room Number</span>
                        {complaint.roomNumber}
                      </div>
                      <div>
                        <span className="block text-white/40">Category</span>
                        {complaint.category}
                      </div>
                      <div>
                        <span className="block text-white/40">Submitted At</span>
                        {new Date(complaint.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolveComplaint(complaint.id)}
                    disabled={complaint.status === 'resolved'}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                      ${complaint.status === 'resolved'
                        ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/80 text-black'
                      }`}
                  >
                    <CheckCircle className={`w-5 h-5 ${complaint.status === 'resolved' ? 'text-green-500' : 'text-black'}`} />
                    {complaint.status === 'resolved' ? 'Resolved' : 'Mark as Resolved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
