"use client";

import { useState } from 'react';
import { TextField, InputAdornment, FormControl, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Search, Poll, ArrowBack, Add, HowToVote, PieChart, Delete, Edit, CheckCircle } from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Vote {
  residentId: string;
  optionId: string;
  timestamp: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'ended';
  totalVotes: number;
  votes: Vote[];
  createdAt: string;
  category: 'general' | 'food' | 'facilities' | 'events' | 'other';
}

// Generate sample data
function generatePolls(): Poll[] {
  const categories: Poll['category'][] = ['general', 'food', 'facilities', 'events', 'other'];
  const samplePolls: Poll[] = [];

  for (let i = 0; i < 10; i++) {
    const options = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
      id: `option-${i}-${j}`,
      text: `Option ${j + 1}`,
      votes: Math.floor(Math.random() * 100)
    }));

    const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
    const votes: Vote[] = [];
    
    // Generate some sample votes
    for (let v = 0; v < totalVotes; v++) {
      votes.push({
        residentId: `resident-${Math.floor(Math.random() * 750)}`,
        optionId: options[Math.floor(Math.random() * options.length)].id,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    samplePolls.push({
      id: `poll-${i}`,
      title: `Sample Poll ${i + 1}`,
      description: `This is a sample poll description for poll ${i + 1}`,
      options,
      startDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['draft', 'active', 'ended'][Math.floor(Math.random() * 3)] as Poll['status'],
      totalVotes,
      votes,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }

  return samplePolls;
}

export default function VotingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [polls, setPolls] = useState(() => generatePolls());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPoll, setNewPoll] = useState<Partial<Poll>>({
    title: '',
    description: '',
    options: [{ id: '1', text: '', votes: 0 }],
    category: 'general'
  });

  // Filter polls
  const filteredPolls = polls.filter(poll => 
    (poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     poll.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'all' || poll.status === filterStatus) &&
    (filterCategory === 'all' || poll.category === filterCategory)
  );

  // Calculate stats
  const stats = [
    {
      title: "Total Polls",
      value: polls.length,
      icon: Poll,
      description: "All Time"
    },
    {
      title: "Active Polls",
      value: polls.filter(p => p.status === 'active').length,
      icon: HowToVote,
      description: "Currently Running"
    },
    {
      title: "Total Votes",
      value: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
      icon: PieChart,
      description: "All Time"
    }
  ];

  // Handle poll creation
  const handleCreatePoll = () => {
    const poll: Poll = {
      id: `poll-${Date.now()}`,
      ...newPoll as Omit<Poll, 'id'>,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      totalVotes: 0,
      votes: [],
      createdAt: new Date().toISOString()
    };

    setPolls(prev => [...prev, poll]);
    setIsCreateDialogOpen(false);
    setNewPoll({
      title: '',
      description: '',
      options: [{ id: '1', text: '', votes: 0 }],
      category: 'general'
    });
  };

  // Add option to new poll
  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: Date.now().toString(), text: '', votes: 0 }]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash">
      {/* Hero Section with Particles */}
      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40] overflow-hidden">
        <FloatingParticles />
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors relative z-10 cursor-pointer"
          >
            <ArrowBack className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between relative">
            <h1 className="text-5xl font-bold text-primary">
              Poll Management
            </h1>
            <ProfileMenu />
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mt-8 flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search polls..."
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
                <MenuItem className="font-clash" value="all">All Status</MenuItem>
                <MenuItem className="font-clash" value="draft">Draft</MenuItem>
                <MenuItem className="font-clash" value="active">Active</MenuItem>
                <MenuItem className="font-clash" value="ended">Ended</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-[200px]">
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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
                <MenuItem className="font-clash" value="all">All Categories</MenuItem>
                <MenuItem className="font-clash" value="general">General</MenuItem>
                <MenuItem className="font-clash" value="food">Food</MenuItem>
                <MenuItem className="font-clash" value="facilities">Facilities</MenuItem>
                <MenuItem className="font-clash" value="events">Events</MenuItem>
                <MenuItem className="font-clash" value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={() => setIsCreateDialogOpen(true)}
              className="font-clash normal-case"
              startIcon={<Add />}
              sx={{
                backgroundColor: 'white',
                color: '#0A4A40',
                fontFamily: 'ClashDisplay, sans-serif',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }
              }}
            >
              Create Poll
            </Button>
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
            Showing {filteredPolls.length} of {polls.length} polls
          </div>

          {/* Polls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPolls.map((poll) => (
              <div
                key={poll.id}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{poll.title}</h3>
                    <p className="text-sm text-white/60 mt-1">{poll.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    poll.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    poll.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {poll.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div key={option.id} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        <span className="text-primary">{Math.round((option.votes / poll.totalVotes) * 100)}%</span>
                      </div>
                      <div className="mt-2 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-full transition-all"
                          style={{ width: `${(option.votes / poll.totalVotes) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center text-sm text-white/60">
                  <span>{poll.totalVotes} votes</span>
                  <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    className="font-clash normal-case"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontFamily: 'ClashDisplay, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    className="font-clash normal-case"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontFamily: 'ClashDisplay, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Delete
                  </Button>
                  {poll.status === 'draft' && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircle />}
                      className="ml-auto font-clash normal-case"
                      sx={{
                        backgroundColor: 'white',
                        color: '#0A4A40',
                        fontFamily: 'ClashDisplay, sans-serif',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }
                      }}
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Poll Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "bg-[#0A4A40] text-white font-clash",
          sx: {
            background: 'rgba(10, 74, 64, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle className="font-clash text-white">Create New Poll</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Poll Title"
              value={newPoll.title}
              onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/10 rounded-xl"
              InputProps={{
                className: "font-clash"
              }}
              InputLabelProps={{
                className: "font-clash text-white/60",
                sx: { fontFamily: 'ClashDisplay, sans-serif' }
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
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newPoll.description}
              onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 rounded-xl"
              InputProps={{
                className: "font-clash"
              }}
              InputLabelProps={{
                className: "font-clash text-white/60",
                sx: { fontFamily: 'ClashDisplay, sans-serif' }
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
            />
            <FormControl fullWidth>
              <Select
                value={newPoll.category}
                onChange={(e) => setNewPoll(prev => ({ ...prev, category: e.target.value as Poll['category'] }))}
                className="bg-white/10 rounded-xl"
                sx={{
                  '& .MuiSelect-select': {
                    color: 'white',
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
                <MenuItem className="font-clash" value="general">General</MenuItem>
                <MenuItem className="font-clash" value="food">Food</MenuItem>
                <MenuItem className="font-clash" value="facilities">Facilities</MenuItem>
                <MenuItem className="font-clash" value="events">Events</MenuItem>
                <MenuItem className="font-clash" value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <div className="space-y-2">
              <p className="font-medium">Options</p>
              {newPoll.options?.map((option, index) => (
                <TextField
                  key={option.id}
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...(newPoll.options || [])];
                    newOptions[index].text = e.target.value;
                    setNewPoll(prev => ({ ...prev, options: newOptions }));
                  }}
                  className="bg-white/10 rounded-xl"
                  InputProps={{
                    className: "font-clash"
                  }}
                  InputLabelProps={{
                    className: "font-clash text-white/60",
                    sx: { fontFamily: 'ClashDisplay, sans-serif' }
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
                />
              ))}
              <Button
                variant="outlined"
                onClick={addOption}
                startIcon={<Add />}
                fullWidth
                className="font-clash normal-case text-white border-white/20 hover:bg-white/10"
                sx={{ fontFamily: 'ClashDisplay, sans-serif' }}
              >
                Add Option
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="border-t border-white/10">
          <Button 
            onClick={() => setIsCreateDialogOpen(false)}
            className="font-clash normal-case text-white/60 hover:text-white"
            sx={{ fontFamily: 'ClashDisplay, sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePoll} 
            variant="contained"
            className="font-clash normal-case"
            sx={{
              backgroundColor: 'white',
              color: '#0A4A40',
              fontFamily: 'ClashDisplay, sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          >
            Create Poll
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Floating Particles component remains the same
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0">
      {/* Add your particle elements here if needed */}
    </div>
  );
}; 