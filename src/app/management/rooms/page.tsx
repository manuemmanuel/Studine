"use client";

import { useState } from 'react';
import { Box, Container, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import {
  Search, FilterList, HomeWork, Engineering, CleaningServices,
  Assignment, History, Notifications, Payment, Person, Close, Add, ArrowBack
} from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';

// Types for room management
interface Resident {
  id: string;
  name: string;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'checking-out' | 'checked-out';
}

interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'dormitory';
  status: 'occupied' | 'vacant' | 'maintenance';
  capacity: number;
  currentOccupants: number;
  condition: 'clean' | 'needs-cleaning' | 'maintenance';
  lastCleaned: string;
  maintenanceStatus?: string;
  amenities: string[];
  residents: Resident[];
}

// Helper function to generate room data
function generateRooms(count: number): Room[] {
  const floors = ['A', 'B', 'C', 'D', 'E'];
  const roomTypes: Array<'single' | 'double' | 'dormitory'> = ['single', 'double', 'dormitory'];
  const statuses: Array<'occupied' | 'vacant' | 'maintenance'> = ['occupied', 'vacant', 'maintenance'];
  const conditions: Array<'clean' | 'needs-cleaning' | 'maintenance'> = ['clean', 'needs-cleaning', 'maintenance'];
  const amenities = ['Bed', 'Desk', 'Wardrobe', 'AC', 'Fan', 'Bathroom', 'Balcony', 'WiFi', 'Hot Water'];

  return Array.from({ length: count }, (_, i) => {
    const floor = floors[Math.floor(i / 50)];
    const roomNumber = (i % 50 + 1).toString().padStart(2, '0');
    const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const capacity = type === 'single' ? 1 : type === 'double' ? 2 : 4;
    const currentOccupants = status === 'occupied' ? 
      Math.floor(Math.random() * capacity) + 1 : 
      status === 'vacant' ? 0 : 0;

    const residents = status === 'occupied' ? Array.from({ length: currentOccupants }, (_, j) => ({
      id: `resident-${i}-${j}`,
      name: `Resident ${j + 1}`,
      checkIn: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      checkOut: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active' as const
    })) : [];

    return {
      id: `${floor}${roomNumber}`,
      number: `${floor}${roomNumber}`,
      type,
      status,
      capacity,
      currentOccupants,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      lastCleaned: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amenities: amenities.slice(0, Math.floor(Math.random() * 5) + 4),
      residents
    };
  });
}

// Add this interface
interface RoomEditModalProps {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onSave: (room: Room) => void;
}

// Add this interface
interface RoomDetailsModalProps {
  room: Room | null;
  open: boolean;
  onClose: () => void;
}

export default function RoomManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [rooms, setRooms] = useState(() => generateRooms(250));
  // Add these states
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Add this handler
  const handleSaveRoom = (updatedRoom: Room) => {
    const updatedRooms = rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setRooms(updatedRooms);
  };

  // Calculate stats based on actual room data
  const stats = [
    { 
      title: "Total Rooms", 
      value: rooms.length.toString(), 
      icon: HomeWork, 
      description: "Currently Active" 
    },
    { 
      title: "Occupied Rooms", 
      value: `${Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100)}%`, 
      icon: Person, 
      description: "Current occupancy" 
    },
    { 
      title: "Maintenance", 
      value: rooms.filter(r => r.status === 'maintenance').length.toString(), 
      icon: Engineering, 
      description: "Pending requests" 
    },
    { 
      title: "Cleaning", 
      value: rooms.filter(r => r.condition === 'needs-cleaning').length.toString(), 
      icon: CleaningServices, 
      description: "Rooms to clean" 
    },
  ];

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash">
      {/* Hero Section with Particles */}
      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40] overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          {/* Add Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-clash"
          >
            <ArrowBack className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between relative">
            <h1 className="text-5xl font-bold text-primary font-clash">
              Room Management
            </h1>
            <ProfileMenu />
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-8 flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-white/60" />
                  </InputAdornment>
                ),
                className: "font-clash",
                sx: {
                  fontFamily: "var(--font-clash-display)"
                }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: "var(--font-clash-display)",
                  color: 'white'
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
            <button className="px-6 py-2 bg-white/10 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors font-clash">
              <FilterList /> Filters
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-16">
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

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="mb-6 text-white/60">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-primary">Room {room.number}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    room.status === 'occupied' ? 'bg-green-500/20 text-green-400' :
                    room.status === 'vacant' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <div className="space-y-2 text-white/80">
                  <p>Type: {room.type}</p>
                  <p>Occupancy: {room.currentOccupants}/{room.capacity}</p>
                  <p>Condition: {room.condition}</p>
                  <p>Last Cleaned: {room.lastCleaned}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm text-white/60 mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 rounded-md text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    onClick={() => {
                      setSelectedRoomForDetails(room);
                      setIsDetailsOpen(true);
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add this at the end of the return statement */}
      <RoomEditModal 
        room={selectedRoom}
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedRoom(null);
        }}
        onSave={handleSaveRoom}
      />

      <RoomDetailsModal
        room={selectedRoomForDetails}
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRoomForDetails(null);
        }}
      />
    </div>
  );
}

// Add the FloatingParticles component from the dashboard
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

// Add the modal component
const RoomEditModal = ({ room, open, onClose, onSave }: RoomEditModalProps) => {
  if (!room) return null;
  const [editedRoom, setEditedRoom] = useState<Room>(room);
  const [newAmenity, setNewAmenity] = useState('');
  const [newResident, setNewResident] = useState({
    name: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: '',
  });

  // Add resident handler
  const handleAddResident = () => {
    if (newResident.name.trim() && newResident.checkOut) {
      setEditedRoom({
        ...editedRoom,
        residents: [...editedRoom.residents, {
          id: `resident-${Date.now()}`,
          name: newResident.name.trim(),
          checkIn: newResident.checkIn,
          checkOut: newResident.checkOut,
          status: 'active' as const
        }],
        currentOccupants: editedRoom.currentOccupants + 1
      });
      setNewResident({
        name: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: '',
      });
    }
  };

  // Remove resident handler
  const handleRemoveResident = (residentId: string) => {
    setEditedRoom({
      ...editedRoom,
      residents: editedRoom.residents.filter(r => r.id !== residentId),
      currentOccupants: editedRoom.currentOccupants - 1
    });
  };

  // Add these handlers
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !editedRoom.amenities.includes(newAmenity.trim())) {
      setEditedRoom({
        ...editedRoom,
        amenities: [...editedRoom.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setEditedRoom({
      ...editedRoom,
      amenities: editedRoom.amenities.filter(a => a !== amenity)
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-[#0A4A40] backdrop-blur-md rounded-xl shadow-lg border border-white/20 font-clash"
      }}
    >
      <DialogTitle className="pb-4 bg-[#0A4A40]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-lg backdrop-blur-sm">
              <HomeWork className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-clash">Room {room.number}</h3>
              <p className="text-sm text-white/60">Edit Room Details</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-clash ${
            editedRoom.status === 'occupied' ? 'bg-green-500/20 text-green-400' :
            editedRoom.status === 'vacant' ? 'bg-blue-500/20 text-blue-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {editedRoom.status}
          </span>
        </div>
      </DialogTitle>

      <DialogContent className="space-y-6 !p-6 bg-[#0A4A40]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Room Status</h4>
            <FormControl fullWidth>
              <Select
                value={editedRoom.status}
                onChange={(e) => setEditedRoom({ ...editedRoom, status: e.target.value as any })}
                className="bg-black/20 rounded-lg font-clash"
                displayEmpty
                renderValue={(value) => value || "Select Status"}
                MenuProps={{
                  PaperProps: {
                    className: "bg-[#0A4A40] border border-white/10"
                  },
                  sx: {
                    "& .MuiMenuItem-root": {
                      fontFamily: "var(--font-clash-display)",
                    }
                  }
                }}
                sx={{ 
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                  fontFamily: "var(--font-clash-display)"
                }}
              >
                <MenuItem value="occupied" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Occupied
                </MenuItem>
                <MenuItem value="vacant" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Vacant
                </MenuItem>
                <MenuItem value="maintenance" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Maintenance
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Condition Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Room Condition</h4>
            <FormControl fullWidth>
              <Select
                value={editedRoom.condition}
                onChange={(e) => setEditedRoom({ ...editedRoom, condition: e.target.value as any })}
                className="bg-black/20 rounded-lg font-clash"
                displayEmpty
                renderValue={(value) => value || "Select Condition"}
                MenuProps={{
                  PaperProps: {
                    className: "bg-[#0A4A40] border border-white/10"
                  },
                  sx: {
                    "& .MuiMenuItem-root": {
                      fontFamily: "var(--font-clash-display)",
                    }
                  }
                }}
                sx={{ 
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                  fontFamily: "var(--font-clash-display)"
                }}
              >
                <MenuItem value="clean" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Clean
                </MenuItem>
                <MenuItem value="needs-cleaning" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Needs Cleaning
                </MenuItem>
                <MenuItem value="maintenance" sx={{ fontFamily: "var(--font-clash-display)" }} className="text-white hover:bg-white/10">
                  Maintenance
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Occupancy Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Occupancy</h4>
            <TextField
              type="number"
              value={editedRoom.currentOccupants}
              onChange={(e) => setEditedRoom({ ...editedRoom, currentOccupants: parseInt(e.target.value) })}
              className="bg-black/20 rounded-lg font-clash"
              placeholder="Enter occupants"
              InputLabelProps={{ shrink: false }}
              variant="outlined"
              sx={{ 
                input: { color: 'white' },
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
              }}
              inputProps={{ min: 0, max: editedRoom.capacity }}
            />
          </div>

          {/* Cleaning Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Cleaning Status: Last Cleaned</h4>
            <TextField
              type="date"
              value={editedRoom.lastCleaned}
              onChange={(e) => setEditedRoom({ ...editedRoom, lastCleaned: e.target.value })}
              className="bg-black/20 rounded-lg font-clash"
              InputLabelProps={{ shrink: false }}
              variant="outlined"
              sx={{ 
                input: { color: 'white' },
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            />
          </div>

          {/* Residents Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Residents</h4>
            
            {/* Add Resident Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <TextField
                value={newResident.name}
                onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
                placeholder="Resident name"
                className="bg-black/20 rounded-lg font-clash"
                InputProps={{
                  className: "font-clash",
                  sx: { fontFamily: "var(--font-clash-display)" }
                }}
                sx={{ 
                  input: { color: 'white', fontFamily: "var(--font-clash-display)" },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <TextField
                type="date"
                value={newResident.checkOut}
                onChange={(e) => setNewResident({ ...newResident, checkOut: e.target.value })}
                className="bg-black/20 rounded-lg font-clash"
                InputProps={{
                  className: "font-clash",
                  sx: { fontFamily: "var(--font-clash-display)" }
                }}
                sx={{ 
                  input: { color: 'white', fontFamily: "var(--font-clash-display)" },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <button
                onClick={handleAddResident}
                disabled={editedRoom.currentOccupants >= editedRoom.capacity}
                className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-clash flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Add className="h-5 w-5" />
                Add Resident
              </button>
            </div>

            {/* Residents List */}
            <div className="grid gap-4">
              {editedRoom.residents.map((resident) => (
                <div 
                  key={resident.id}
                  className="bg-black/20 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-white font-clash">{resident.name}</p>
                    <div className="flex gap-4 text-sm text-white/60">
                      <span>Check-in: {resident.checkIn}</span>
                      <span>Check-out: {resident.checkOut}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-clash ${
                      resident.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      resident.status === 'checking-out' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {resident.status}
                    </span>
                    <button
                      onClick={() => handleRemoveResident(resident.id)}
                      className="text-white/60 hover:text-white/80"
                    >
                      <Close className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Amenities</h4>
            
            {/* Add Amenity Input */}
            <div className="flex gap-2 mb-4">
              <TextField
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                placeholder="Add new amenity"
                className="bg-black/20 rounded-lg font-clash flex-grow"
                InputProps={{
                  className: "font-clash",
                  sx: { fontFamily: "var(--font-clash-display)" }
                }}
                sx={{ 
                  input: { color: 'white', fontFamily: "var(--font-clash-display)" },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <button
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-clash flex items-center gap-2"
              >
                <Add className="h-5 w-5" />
                Add
              </button>
            </div>

            {/* Amenities List */}
            <div className="flex flex-wrap gap-2">
              {editedRoom.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-black/20 rounded-md text-white text-sm font-clash flex items-center gap-2 group"
                >
                  {amenity}
                  <button
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Close className="h-4 w-4 text-white/60 hover:text-white/80" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-4 border-t border-white/10 bg-[#0A4A40]">
        <div className="flex gap-2 w-full">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-clash"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editedRoom);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-clash"
          >
            Save Changes
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

// Add the new modal component
const RoomDetailsModal = ({ room, open, onClose }: RoomDetailsModalProps) => {
  if (!room) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-[#0A4A40] backdrop-blur-md rounded-xl shadow-lg border border-white/20 font-clash"
      }}
    >
      <DialogTitle className="pb-4 bg-[#0A4A40]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-lg backdrop-blur-sm">
              <HomeWork className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-clash">Room {room.number}</h3>
              <p className="text-sm text-white/60">Room Details</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-clash ${
            room.status === 'occupied' ? 'bg-green-500/20 text-green-400' :
            room.status === 'vacant' ? 'bg-blue-500/20 text-blue-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {room.status}
          </span>
        </div>
      </DialogTitle>

      <DialogContent className="space-y-6 !p-6 bg-[#0A4A40]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Room Status</h4>
            <p className="text-white font-clash capitalize">{room.status}</p>
          </div>

          {/* Condition Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Room Condition</h4>
            <p className="text-white font-clash capitalize">{room.condition}</p>
          </div>

          {/* Occupancy Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Occupancy</h4>
            <p className="text-white font-clash">{room.currentOccupants} / {room.capacity}</p>
          </div>

          {/* Cleaning Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Cleaning Status</h4>
            <p className="text-white font-clash">Last Cleaned: {room.lastCleaned}</p>
          </div>

          {/* Residents Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Current Residents</h4>
            {room.residents.length > 0 ? (
              <div className="grid gap-4">
                {room.residents.map((resident) => (
                  <div 
                    key={resident.id}
                    className="bg-black/20 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-white font-clash">{resident.name}</p>
                      <div className="flex gap-4 text-sm text-white/60">
                        <span>Check-in: {resident.checkIn}</span>
                        <span>Check-out: {resident.checkOut}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-clash ${
                      resident.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      resident.status === 'checking-out' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {resident.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 font-clash">No current residents</p>
            )}
          </div>

          {/* Amenities Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-black/20 rounded-md text-white text-sm font-clash"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-4 border-t border-white/10 bg-[#0A4A40]">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-clash"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};
