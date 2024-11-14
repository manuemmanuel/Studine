"use client";

import { useState } from 'react';
import { TextField, Button } from "@mui/material";
import { Campaign, DeleteOutline, ArrowBack } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import Link from 'next/link';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
}

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
  );
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium' as const
  });

  const handleSubmit = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      ...newAnnouncement,
      date: new Date()
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium' });
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash relative pb-24">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/management/dashboard">
          <Button 
            startIcon={<ArrowBack className="text-white" />}
            className="
              bg-white/10 hover:bg-white/20
              text-white font-clash normal-case px-4 py-2
              rounded-xl shadow-lg 
              transition-all duration-300 ease-out
              hover:-translate-y-0.5
              backdrop-blur-sm border border-white/10
            "
            sx={{ 
              fontFamily: 'var(--font-clash-display)',
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'none',
              color: 'white',
              '& .MuiButton-startIcon': {
                marginRight: '4px',
                color: 'white'
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              },
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: 'none',
              '& .MuiTouchRipple-root': {
                display: 'none'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40] overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 text-primary font-clash inline-flex items-center gap-4">
                Announcements
                <div className="ml-4">
                  <ProfileMenu />
                </div>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
                Create and manage hostel announcements
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Campaign className="text-[#0A4A40] h-6 w-6" />
              <h2 className="text-2xl font-bold text-white/90">New Announcement</h2>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-white/60 font-clash text-sm">Announcement Title</label>
                <TextField
                  fullWidth
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  InputProps={{
                    sx: { 
                      fontFamily: 'var(--font-clash-display)',
                      color: 'white'
                    }
                  }}
                  sx={{ 
                    input: { color: 'white' },
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white/60 font-clash text-sm">Announcement Content</label>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  InputProps={{
                    sx: { 
                      fontFamily: 'var(--font-clash-display)',
                      color: 'white'
                    }
                  }}
                  sx={{ 
                    '.MuiInputBase-input': { color: 'white' },
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }
                    }
                  }}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  startIcon={<Campaign className="text-black" />}
                  className="
                    bg-gradient-to-r from-primary to-primary/80 
                    hover:from-primary/90 hover:to-primary/70
                    text-black font-clash normal-case px-6 py-3
                    rounded-xl shadow-lg hover:shadow-primary/20
                    transition-all duration-300 ease-out
                    hover:-translate-y-0.5
                    disabled:opacity-50 disabled:hover:translate-y-0
                    backdrop-blur-sm border border-white/10
                  "
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                  sx={{ 
                    fontFamily: 'var(--font-clash-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    color: 'black',
                    '& .MuiButton-startIcon': {
                      marginRight: '8px'
                    }
                  }}
                >
                  Publish Announcement
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-24">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">{announcement.title}</h3>
                    <p className="text-white/70 mb-4">{announcement.content}</p>
                    <p className="text-sm text-white/50">
                      Published on {announcement.date.toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <DeleteOutline />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
