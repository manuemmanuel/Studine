"use client";

import { useState } from 'react';
import { TextField, InputAdornment, FormControl, MenuItem, Select } from "@mui/material";
import { Search, Person, ArrowBack, Home, CalendarToday, Badge, Phone } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';

// Types
interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  bedNumber: number;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'checking-out' | 'checked-out';
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

// Generate sample data
function generateResidents(count: number): Resident[] {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `resident-${i}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    roomNumber: `${String.fromCharCode(65 + Math.floor(i / 75))}${Math.floor((i % 75) / 3 + 1).toString().padStart(2, '0')}`,
    bedNumber: (i % 3) + 1,
    phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    email: `resident${i + 1}@example.com`,
    checkIn: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: ['active', 'checking-out', 'checked-out'][Math.floor(Math.random() * 3)] as Resident['status'],
    emergencyContact: {
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      relation: ['Parent', 'Sibling', 'Spouse', 'Guardian'][Math.floor(Math.random() * 4)],
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
    }
  }));
}

export default function ResidentsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState(() => generateResidents(750));
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const residentsPerPage = 20;

  // Filter and sort residents
  const filteredResidents = residents
    .filter(resident => 
      (resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       resident.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       resident.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === 'all' || resident.status === filterStatus)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'room':
          return a.roomNumber.localeCompare(b.roomNumber);
        case 'checkIn':
          return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / residentsPerPage);
  const paginatedResidents = filteredResidents.slice(
    (page - 1) * residentsPerPage,
    page * residentsPerPage
  );

  // Calculate stats
  const stats = [
    {
      title: "Total Residents",
      value: residents.length,
      icon: Person,
      description: "All Residents"
    },
    {
      title: "Active Residents",
      value: residents.filter(r => r.status === 'active').length,
      icon: Home,
      description: "Currently Staying"
    },
    {
      title: "Total Blocks",
      value: Math.ceil(residents.length / 75), // 25 rooms per block, 3 beds per room
      icon: Home,
      description: "Housing Blocks"
    }
  ];

  // Add pagination controls
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-white/60">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );

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
              Residents Directory
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
                <MenuItem value="all" className="font-clash">All Residents</MenuItem>
                <MenuItem value="active" className="font-clash">Active</MenuItem>
                <MenuItem value="checking-out" className="font-clash">Checking Out</MenuItem>
                <MenuItem value="checked-out" className="font-clash">Checked Out</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-[200px]">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
                <MenuItem value="name" className="font-clash">Sort by Name</MenuItem>
                <MenuItem value="room" className="font-clash">Sort by Room</MenuItem>
                <MenuItem value="checkIn" className="font-clash">Sort by Check-in Date</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            Showing {paginatedResidents.length} of {filteredResidents.length} residents
            {searchQuery && ` (filtered from ${residents.length} total)`}
          </div>

          {/* Residents List */}
          <div className="space-y-4">
            {paginatedResidents.map((resident) => (
              <div
                key={resident.id}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Person className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">{resident.name}</h3>
                        <p className="text-sm text-white/60">Room {resident.roomNumber} • Bed {resident.bedNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/60">Contact Information</p>
                        <p className="text-white flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {resident.phone}
                        </p>
                        <p className="text-white">{resident.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Stay Duration</p>
                        <p className="text-white flex items-center gap-2">
                          <CalendarToday className="h-4 w-4" />
                          {new Date(resident.checkIn).toLocaleDateString()} - {new Date(resident.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      resident.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      resident.status === 'checking-out' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {resident.status}
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60 mb-2">Emergency Contact</p>
                  <div className="flex items-center gap-4">
                    <Badge className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white">{resident.emergencyContact.name}</p>
                      <p className="text-sm text-white/60">{resident.emergencyContact.relation} • {resident.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination />
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
