"use client";

import { useState, FC } from 'react';
import {
  Card,
  Select,
  Button,
  Input,
  Table,
  Tabs,
  MenuItem,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Search, ArrowBack } from '@mui/icons-material';
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface PaymentTemplate {
  id: string;
  name: string;
  description: string;
  categories: {
    categoryId: string;
    items: {
      chargeTypeId: string;
      amount: number;
    }[];
  }[];
}

interface ChargeType {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface FeeEntry {
  amount: number;
  justification: string;
  timestamp: Date;
}

// Update TextField styles
const textFieldStyles = {
  '& .MuiInputBase-input': {
    color: 'white',
    fontFamily: 'ClashDisplay-Regular, sans-serif'
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: 'ClashDisplay-Regular, sans-serif',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'ClashDisplay-Regular, sans-serif'
  }
};

// Update Select styles
const selectStyles = {
  color: 'white',
  fontFamily: 'ClashDisplay-Regular, sans-serif',
  '& .MuiSelect-select': {
    fontFamily: 'ClashDisplay-Regular, sans-serif'
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
};

// Update Tab styles
const tabStyles = {
  fontFamily: 'ClashDisplay-Regular, sans-serif',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiTab-root': {
    fontFamily: 'ClashDisplay-Regular, sans-serif',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: 'white'
    }
  },
  '& .MuiTabs-indicator': {
    backgroundColor: 'white'
  }
};

// Add these new styles at the top with your other styles
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
  }
};

const buttonStyles = {
  background: 'linear-gradient(45deg, #059669 30%, #10B981 90%)',
  transition: 'all 0.3s ease',
  boxShadow: '0 3px 15px rgba(16, 185, 129, 0.2)',
  '&:hover': {
    boxShadow: '0 5px 20px rgba(16, 185, 129, 0.4)',
    transform: 'translateY(-2px)'
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    boxShadow: 'none'
  }
};

const PaymentManagementPage: FC = () => {
  const router = useRouter();
  // States for managing templates and selections
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [feeAmount, setFeeAmount] = useState<string>('');
  const [feeJustification, setFeeJustification] = useState<string>('');
  const [feeEntries, setFeeEntries] = useState<FeeEntry[]>([]);

  const handleAddFee = () => {
    if (!feeAmount || !feeJustification) return;
    
    const newFee: FeeEntry = {
      amount: parseFloat(feeAmount),
      justification: feeJustification,
      timestamp: new Date()
    };
    
    setFeeEntries([...feeEntries, newFee]);
    setFeeAmount('');
    setFeeJustification('');
  };

  // Sample data (move to API calls later)
  const categories: Category[] = [
    { id: 'room', name: 'Room Charges', description: 'All room-related charges' },
    { id: 'food', name: 'Food Services', description: 'Meal plan charges' },
    { id: 'utilities', name: 'Utilities', description: 'Utility charges' },
  ];

  const chargeTypes: ChargeType[] = [
    { 
      id: 'regular-room',
      name: 'Regular Room',
      description: 'Standard room charges',
      categoryId: 'room'
    },
    // Add more charge types
  ];

  const templates: PaymentTemplate[] = [
    {
      id: 'template1',
      name: 'Standard Room Package',
      description: 'Regular room with basic utilities',
      categories: [
        {
          categoryId: 'room',
          items: [
            { chargeTypeId: 'regular-room', amount: 5000 }
          ]
        }
      ]
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
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-clash"
          >
            <ArrowBack className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between relative">
            <h1 className="text-5xl font-bold text-primary font-clash">
              Payment Management
            </h1>
            <ProfileMenu />
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-8 flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search templates..."
              className="bg-white/10 rounded-xl"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-white/60" />
                  </InputAdornment>
                ),
                classes: {
                  input: "font-clash"
                }
              }}
              sx={textFieldStyles}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 -mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel */}
            <div className="col-span-3">
              <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <h2 className="text-lg font-semibold mb-4 font-clash">Resident Selection</h2>
                <Select
                  multiple
                  value={selectedResidents}
                  placeholder="Select residents"
                  className="w-full mb-4 bg-white/10 font-clash"
                  onChange={(event) => setSelectedResidents(event.target.value as string[])}
                  sx={selectStyles}
                >
                  {/* Add MenuItem components for residents here */}
                </Select>
                
                <h2 className="text-lg font-semibold mb-4 font-clash">Templates</h2>
                <Select
                  value={selectedTemplate}
                  placeholder="Select a template"
                  className="w-full mb-4 bg-white/10 font-clash"
                  onChange={(event) => setSelectedTemplate(event.target.value as string)}
                  sx={selectStyles}
                >
                  {templates.map(template => (
                    <MenuItem key={template.id} value={template.id} className="font-clash">
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-9">
              <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <TabContext value={activeTab}>
                  <TabList 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={tabStyles}
                  >
                    <Tab label="Fee Templates" value="templates" />
                    <Tab label="Add Charges" value="charges" />
                  </TabList>
                  <TabPanel value="templates">
                    {templates.map(template => (
                      <div key={template.id} className="border-b border-white/10 last:border-b-0 py-4">
                        <h3 className="font-semibold text-white font-clash">{template.name}</h3>
                        <p className="text-white/60 font-clash">{template.description}</p>
                        {template.categories.map(category => (
                          <div key={category.categoryId} className="ml-4 mt-2 font-clash">
                            {category.items.map(item => (
                              <div key={item.chargeTypeId} className="text-white/80">
                                {item.chargeTypeId}: ${item.amount}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </TabPanel>
                  <TabPanel value="charges" className="space-y-8">
                    {/* Add New Fee Form */}
                    <div className="transform transition-all duration-300 hover:scale-[1.01]">
                      <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
                        <h3 className="text-2xl font-semibold mb-6 font-clash bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                          Add New Fee
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                          <TextField
                            fullWidth
                            type="number"
                            label="Amount"
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <span className="text-emerald-400">$</span>
                                </InputAdornment>
                              ),
                              classes: { input: "font-clash text-lg" }
                            }}
                            sx={textFieldStyles}
                          />
                          <TextField
                            fullWidth
                            multiline
                            rows={1}
                            label="Justification"
                            value={feeJustification}
                            onChange={(e) => setFeeJustification(e.target.value)}
                            InputProps={{
                              classes: { input: "font-clash text-lg" }
                            }}
                            sx={textFieldStyles}
                          />
                        </div>
                        <Button
                          variant="contained"
                          onClick={handleAddFee}
                          sx={buttonStyles}
                          className="mt-6 py-3 px-8 text-lg font-clash"
                          disabled={!feeAmount || !feeJustification}
                        >
                          Add Fee
                        </Button>
                      </div>
                    </div>

                    {/* Fee Entries List */}
                    <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
                      <h3 className="text-2xl font-semibold mb-6 font-clash bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Fee History
                      </h3>
                      <div className="space-y-4">
                        {feeEntries.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-white/60 font-clash text-lg">No fees added yet</p>
                            <p className="text-white/40 font-clash mt-2">Add your first fee using the form above</p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {feeEntries.map((fee, index) => (
                              <div 
                                key={index}
                                className="transform transition-all duration-300 hover:scale-[1.02]"
                              >
                                <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-2xl font-semibold font-clash bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                        ${fee.amount.toFixed(2)}
                                      </span>
                                      <p className="text-white/80 mt-2 font-clash text-lg">
                                        {fee.justification}
                                      </p>
                                    </div>
                                    <span className="text-sm text-white/60 font-clash bg-white/5 px-4 py-2 rounded-full">
                                      {fee.timestamp.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                </TabContext>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add Floating Particles component
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
export default PaymentManagementPage;

