"use client";

import { useState } from 'react';
import { TextField, InputAdornment, FormControl, MenuItem, Select } from "@mui/material";
import { Search, Person, ArrowBack, CalendarToday, DirectionsCar, Schedule } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface Movement {
  id: string;
  residentId: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  status: 'ongoing' | 'returned' | 'overdue';
}

interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  bedNumber: number;
  movements: Movement[];
}

// Sample data generator
function generateMovements(count: number): Resident[] {
  const purposes = ['Family Visit', 'Medical', 'Weekend Trip', 'Official Work', 'Personal Work'];
  const destinations = ['Home', 'Hospital', 'Office', 'Other City', 'University'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `resident-${i}`,
    name: `Resident ${i + 1}`,
    roomNumber: `A${Math.floor(i / 3 + 1).toString().padStart(2, '0')}`,
    bedNumber: (i % 3) + 1,
    movements: Array.from({ length: Math.floor(Math.random() * 3) }, (_, j) => ({
      id: `movement-${i}-${j}`,
      residentId: `resident-${i}`,
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      departureDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: ['ongoing', 'returned', 'overdue'][Math.floor(Math.random() * 3)] as Movement['status']
    }))
  }));
}

export default function MovementManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [residents, setResidents] = useState(() => generateMovements(50));
  const [filterStatus, setFilterStatus] = useState('all');

  // Get all active movements
  const activeMovements = residents.flatMap(resident =>
    resident.movements.map(movement => ({
      ...movement,
      residentName: resident.name,
      roomNumber: resident.roomNumber,
      bedNumber: resident.bedNumber
    }))
  ).filter(movement => 
    (movement.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     movement.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'all' || movement.status === filterStatus)
  );

  // Calculate stats
  const stats = [
    {
      title: "Currently Out",
      value: activeMovements.filter(m => m.status === 'ongoing').length,
      icon: DirectionsCar,
      description: "Residents Away"
    },
    {
      title: "Overdue Returns",
      value: activeMovements.filter(m => m.status === 'overdue').length,
      icon: Schedule,
      description: "Past Return Date"
    }
  ];

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
              Movement Tracking
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
                <MenuItem value="all" className="font-clash">All Movements</MenuItem>
                <MenuItem value="ongoing" className="font-clash">Currently Out</MenuItem>
                <MenuItem value="returned" className="font-clash">Returned</MenuItem>
                <MenuItem value="overdue" className="font-clash">Overdue</MenuItem>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMovements.map((movement) => (
              <div
                key={movement.id}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{movement.residentName}</h3>
                    <p className="text-sm text-white/60">
                      Room {movement.roomNumber} • Bed {movement.bedNumber}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    movement.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                    movement.status === 'returned' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {movement.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <DirectionsCar className="h-5 w-5" />
                    <span>{movement.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CalendarToday className="h-5 w-5" />
                    <div>
                      <p>Departure: {new Date(movement.departureDate).toLocaleDateString()}</p>
                      <p>Return: {new Date(movement.returnDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/80">Purpose: {movement.purpose}</p>
                  </div>
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
