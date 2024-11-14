"use client";

import { useState } from 'react';
import { Box, Container, TextField, InputAdornment, Dialog, Select, MenuItem, FormControl } from "@mui/material";
import { Search, FilterList, Person, ArrowBack, CalendarMonth, Check, Close } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  bedNumber: number;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'checking-out' | 'checked-out';
}

interface AttendanceRecord {
  date: string;
  present: boolean;
  notes?: string;
}

interface ResidentAttendance extends Resident {
  attendance: AttendanceRecord[];
}

// Generate sample data
function generateResidents(roomCount: number): ResidentAttendance[] {
  const residents: ResidentAttendance[] = [];
  
  for (let room = 1; room <= roomCount; room++) {
    // Generate 3 residents per room
    for (let bed = 1; bed <= 3; bed++) {
      residents.push({
        id: `resident-${room}-${bed}`,
        name: `Resident ${(room-1)*3 + bed}`,
        roomNumber: `A${room.toString().padStart(2, '0')}`,
        bedNumber: bed,
        checkIn: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOut: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active' as const,
        attendance: Array.from({ length: 30 }, (_, j) => ({
          date: new Date(Date.now() - j * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          present: Math.random() > 0.1,
          notes: Math.random() > 0.8 ? 'Late arrival' : undefined
        }))
      });
    }
  }
  return residents;
}

export default function AttendanceManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [residents, setResidents] = useState(() => generateResidents(250));
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter residents based on search and status
  const filteredResidents = residents.filter(resident => 
    (resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     resident.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'all' || resident.status === filterStatus)
  );

  // Calculate stats
  const todayStr = new Date().toISOString().split('T')[0];
  const stats = [
    {
      title: "Total Residents",
      value: residents.length,
      icon: Person,
      description: "Currently Active"
    },
    {
      title: "Present Today",
      value: `${Math.round((residents.filter(r => 
        r.attendance.find(a => a.date === todayStr)?.present ?? false
      ).length / residents.length) * 100)}%`,
      icon: Check,
      description: "Attendance Rate"
    }
  ];

  // Handle attendance toggle
  const toggleAttendance = (residentId: string, date: string, present: boolean) => {
    setResidents(prev => prev.map(resident => {
      if (resident.id === residentId) {
        const existingRecord = resident.attendance.find(a => a.date === date);
        const newAttendance = existingRecord
          ? resident.attendance.map(a => a.date === date ? { ...a, present } : a)
          : [...resident.attendance, { date, present }];
        
        return {
          ...resident,
          attendance: newAttendance
        };
      }
      return resident;
    }));
  };

  // Group residents by room
  const groupedResidents = filteredResidents.reduce((acc, resident) => {
    if (!acc[resident.roomNumber]) {
      acc[resident.roomNumber] = [];
    }
    acc[resident.roomNumber].push(resident);
    return acc;
  }, {} as Record<string, ResidentAttendance[]>);

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash">
      {/* Hero Section with Particles */}
      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40] overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowBack className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between relative">
            <h1 className="text-5xl font-bold text-primary">
              Attendance Management
            </h1>
            <ProfileMenu />
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-8 flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search residents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-white/60" />
                  </InputAdornment>
                ),
                className: "font-clash"
              }}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: 'ClashDisplay, sans-serif'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }
              }}
              className="bg-white/10 rounded-xl"
            />

            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker 
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue || new Date())}
                className="bg-white/10 rounded-xl"
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'white',
                    fontFamily: 'ClashDisplay, sans-serif'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
              />
            </LocalizationProvider>

            <FormControl className="min-w-[200px]">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 rounded-xl text-white font-clash"
                sx={{
                  '& .MuiSelect-select': {
                    fontFamily: 'ClashDisplay, sans-serif'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
              >
                <MenuItem value="all" className="font-clash">All Residents</MenuItem>
                <MenuItem value="active" className="font-clash">Active</MenuItem>
                <MenuItem value="checking-out" className="font-clash">Checking Out</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="mb-6 text-white/60">
            Showing {filteredResidents.length} of {residents.length} residents
          </div>

          {/* Residents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedResidents).map(([roomNumber, roomResidents]) => (
              <div
                key={roomNumber}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                <h3 className="text-2xl font-bold text-primary mb-4">Room {roomNumber}</h3>
                
                <div className="space-y-4">
                  {roomResidents.sort((a, b) => a.bedNumber - b.bedNumber).map((resident) => {
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    const attendanceRecord = resident.attendance.find(a => a.date === dateStr);
                    const isPresent = attendanceRecord?.present ?? false;

                    return (
                      <div key={resident.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium text-white">{resident.name}</p>
                            <p className="text-sm text-white/60">Bed {resident.bedNumber}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            resident.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            resident.status === 'checking-out' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {resident.status}
                          </span>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => toggleAttendance(resident.id, dateStr, true)}
                            className={`flex-1 px-3 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm ${
                              isPresent ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                          >
                            <Check className="h-4 w-4" />
                            Present
                          </button>
                          <button
                            onClick={() => toggleAttendance(resident.id, dateStr, false)}
                            className={`flex-1 px-3 py-1 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm ${
                              !isPresent ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/20'
                            }`}
                          >
                            <Close className="h-4 w-4" />
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Floating Particles component
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
