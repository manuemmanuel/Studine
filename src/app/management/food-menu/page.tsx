"use client";

import React, { useEffect, useState } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputAdornment, FormControl, InputLabel } from "@mui/material";
import {
  Search, FilterList, Restaurant, Timer, LocalDining, TrendingUp,
  ArrowBack, Add, Close, Edit, Save, Cancel
} from "@mui/icons-material";
import { ProfileMenu } from "@/components/profile-menu";
import { useRouter } from 'next/navigation';

// Types
interface MenuItem {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  category: 'veg' | 'non-veg' | 'vegan';
  price: number;
  available: boolean;
  description: string;
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  popularity: number;
  imageUrl?: string;
}

interface MenuEditModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

interface Meals {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

interface MenuDay {
  day: string;
  meals: Meals;
}

// Generate sample menu items
function generateMenuItems(): MenuItem[] {
  return [];
}

// Add this component before the main FoodMenuManagement component
const MenuItemCard = ({ item, onEdit }: { item: MenuItem, onEdit: () => void }) => {
  return (
    <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-white/20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-primary">{item.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          item.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {item.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="space-y-2 text-white/80">
        <p>{item.description}</p>
        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-primary/20 rounded-md text-xs text-primary">
            {item.type}
          </span>
          <span className="px-2 py-1 bg-primary/20 rounded-md text-xs text-primary">
            {item.category}
          </span>
        </div>
      </div>

      {item.nutritionalInfo && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-sm text-white/60 mb-2">Nutritional Info:</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-sm text-white/60">Calories</p>
              <p className="text-primary font-bold">{item.nutritionalInfo.calories}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Protein</p>
              <p className="text-primary font-bold">{item.nutritionalInfo.protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Carbs</p>
              <p className="text-primary font-bold">{item.nutritionalInfo.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Fat</p>
              <p className="text-primary font-bold">{item.nutritionalInfo.fat}g</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <h4 className="text-sm text-white/60 mb-2">Allergens:</h4>
        <div className="flex flex-wrap gap-2">
          {item.allergens.map((allergen, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/5 rounded-md text-xs"
            >
              {allergen}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          onClick={onEdit}
        >
          <Edit className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const MenuEditModal = ({ item, open, onClose, onSave }: MenuEditModalProps) => {
  const [editedItem, setEditedItem] = useState<MenuItem | null>(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSubmit = () => {
    if (editedItem) {
      onSave(editedItem);
      onClose();
    }
  };

  if (!editedItem) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-[#0A4A40] backdrop-blur-md rounded-xl shadow-lg border border-white/20"
      }}
      sx={{
        '& .MuiDialog-paper': {
          fontFamily: 'var(--font-clash-display)'
        }
      }}
    >
      <DialogTitle className="pb-4 bg-[#0A4A40]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-lg backdrop-blur-sm">
              <Restaurant className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-clash">
                {item?.id.startsWith('new-') ? 'Add New Item' : 'Edit Menu Item'}
              </h3>
              <p className="text-sm text-white/60">Edit menu item details</p>
            </div>
          </div>
        </div>
      </DialogTitle>

      <DialogContent className="space-y-6 !p-6 bg-[#0A4A40]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Details Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Basic Details</h4>
            <div className="grid gap-4">
              <TextField
                fullWidth
                label="Item Name"
                value={editedItem?.name}
                onChange={(e) => setEditedItem(prev => prev ? {...prev, name: e.target.value} : null)}
                className="bg-black/20 rounded-lg"
                InputLabelProps={{ 
                  className: "text-white/60",
                  shrink: true,
                  sx: { 
                    fontFamily: 'var(--font-clash-display)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.75)'
                    }
                  }
                }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontFamily: 'var(--font-clash-display)',
                    transform: 'translate(14px, 16px) scale(1)'
                  },
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <TextField
                fullWidth
                label="Description"
                value={editedItem?.description}
                onChange={(e) => setEditedItem(prev => prev ? {...prev, description: e.target.value} : null)}
                multiline
                rows={3}
                className="bg-black/20 rounded-lg"
                InputLabelProps={{ 
                  className: "text-white/60",
                  shrink: true,
                  sx: { 
                    fontFamily: 'var(--font-clash-display)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.75)'
                    }
                  }
                }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    fontFamily: 'var(--font-clash-display)',
                    transform: 'translate(14px, 16px) scale(1)'
                  },
                  input: { color: 'white' },
                  '.MuiInputBase-input': { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
            </div>
          </div>

          {/* Type and Category Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Type & Category</h4>
            <div className="grid gap-4">
              <FormControl fullWidth>
                <InputLabel 
                  className="text-white/60 font-clash"
                  sx={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  Type
                </InputLabel>
                <Select
                  value={editedItem?.type}
                  onChange={(e) => setEditedItem(prev => prev ? {...prev, type: e.target.value as any} : null)}
                  className="bg-black/20 rounded-lg"
                  sx={{ 
                    fontFamily: 'var(--font-clash-display)',
                    '& .MuiSelect-select': {
                      fontFamily: 'var(--font-clash-display)'
                    },
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="breakfast">Breakfast</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="lunch">Lunch</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="dinner">Dinner</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="snack">Snack</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel 
                  className="text-white/60 font-clash"
                  sx={{ fontFamily: 'var(--font-clash-display)' }}
                >
                  Category
                </InputLabel>
                <Select
                  value={editedItem?.category}
                  onChange={(e) => setEditedItem(prev => prev ? {...prev, category: e.target.value as any} : null)}
                  className="bg-black/20 rounded-lg"
                  sx={{ 
                    fontFamily: 'var(--font-clash-display)',
                    '& .MuiSelect-select': {
                      fontFamily: 'var(--font-clash-display)'
                    },
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="veg">Vegetarian</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="non-veg">Non-Vegetarian</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="vegan">Vegan</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Price and Availability Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Price & Availability</h4>
            <div className="grid gap-4">
              <TextField
                type="number"
                label="Price"
                value={editedItem?.price}
                onChange={(e) => setEditedItem(prev => prev ? {...prev, price: Number(e.target.value)} : null)}
                className="bg-black/20 rounded-lg"
                InputLabelProps={{ className: "text-white/60" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  className: "font-clash text-white",
                }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <FormControl fullWidth>
                <InputLabel className="text-white/60">Availability</InputLabel>
                <Select
                  value={editedItem?.available}
                  onChange={(e) => setEditedItem(prev => prev ? {...prev, available: e.target.value as boolean} : null)}
                  className="bg-black/20 rounded-lg"
                  sx={{ 
                    fontFamily: 'var(--font-clash-display)',
                    '& .MuiSelect-select': {
                      fontFamily: 'var(--font-clash-display)'
                    },
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                >
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="true">Available</MenuItem>
                  <MenuItem sx={{ fontFamily: 'var(--font-clash-display)' }} value="false">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Nutritional Info Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h4 className="text-white/80 mb-4 font-clash">Nutritional Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                type="number"
                label="Calories"
                value={editedItem?.nutritionalInfo?.calories || 0}
                onChange={(e) => setEditedItem(prev => prev ? {
                  ...prev,
                  nutritionalInfo: {
                    calories: Number(e.target.value),
                    protein: prev.nutritionalInfo?.protein || 0,
                    carbs: prev.nutritionalInfo?.carbs || 0,
                    fat: prev.nutritionalInfo?.fat || 0
                  }
                } : null)}
                InputLabelProps={{ shrink: false }}
                className="bg-black/20 rounded-lg"
                InputProps={{ className: "font-clash text-white" }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <TextField
                type="number"
                label="Protein (g)"
                value={editedItem?.nutritionalInfo?.protein || 0}
                onChange={(e) => setEditedItem(prev => prev ? {
                  ...prev,
                  nutritionalInfo: {
                    calories: prev.nutritionalInfo?.calories || 0,
                    protein: Number(e.target.value),
                    carbs: prev.nutritionalInfo?.carbs || 0,
                    fat: prev.nutritionalInfo?.fat || 0
                  }
                } : null)}
                InputLabelProps={{ shrink: false }}
                className="bg-black/20 rounded-lg"
                InputProps={{ className: "font-clash text-white" }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <TextField
                type="number"
                label="Carbs (g)"
                value={editedItem?.nutritionalInfo?.carbs || 0}
                onChange={(e) => setEditedItem(prev => prev ? {
                  ...prev,
                  nutritionalInfo: {
                    calories: prev.nutritionalInfo?.calories || 0,
                    protein: prev.nutritionalInfo?.protein || 0,
                    carbs: Number(e.target.value),
                    fat: prev.nutritionalInfo?.fat || 0
                  }
                } : null)}
                InputLabelProps={{ shrink: false }}
                className="bg-black/20 rounded-lg"
                InputProps={{ className: "font-clash text-white" }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
              <TextField
                type="number"
                label="Fat (g)"
                value={editedItem?.nutritionalInfo?.fat || 0}
                onChange={(e) => setEditedItem(prev => prev ? {
                  ...prev,
                  nutritionalInfo: {
                    calories: prev.nutritionalInfo?.calories || 0,
                    protein: prev.nutritionalInfo?.protein || 0,
                    carbs: prev.nutritionalInfo?.carbs || 0,
                    fat: Number(e.target.value)
                  }
                } : null)}
                InputLabelProps={{ shrink: false }}
                className="bg-black/20 rounded-lg"
                InputProps={{ className: "font-clash text-white" }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
            </div>
          </div>

          {/* Allergens Card */}
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20 col-span-full">
            <h4 className="text-white/80 mb-4 font-clash">Allergens</h4>
            <div className="flex flex-wrap gap-2">
              {editedItem?.allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-black/20 rounded-md text-white text-sm font-clash flex items-center gap-2"
                >
                  {allergen}
                  <button
                    onClick={() => setEditedItem(prev => prev ? {
                      ...prev,
                      allergens: prev.allergens.filter((_, i) => i !== index)
                    } : null)}
                    className="text-white/60 hover:text-white/80"
                  >
                    <Close className="h-4 w-4" />
                  </button>
                </span>
              ))}
              <TextField
                placeholder="Add allergen"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && editedItem) {
                      setEditedItem({
                        ...editedItem,
                        allergens: [...editedItem.allergens, value]
                      });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                className="bg-black/20 rounded-lg"
                InputProps={{ className: "font-clash text-white" }}
                sx={{ 
                  input: { color: 'white' },
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              />
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
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-clash"
          >
            Save Changes
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default function FoodMenuManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [menuItems, setMenuItems] = useState(() => generateMenuItems());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [weeklyMenu, setWeeklyMenu] = useState<MenuDay[]>([
    {
      day: "Monday",
      meals: {
        breakfast: ["Idli", "Sambar", "Chutney", "Coffee/Tea"],
        lunch: ["Rice", "Dal", "Mixed Veg Curry", "Curd", "Pickle"],
        dinner: ["Chapati", "Paneer Butter Masala", "Rice", "Dal"]
      }
    },
    // ... rest of your menu data
  ]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editedMeals, setEditedMeals] = useState<Meals | null>(null);

  const handleSaveItem = (updatedItem: MenuItem) => {
    const updatedItems = menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setMenuItems(updatedItems);
  };

  const handleMenuEdit = (day: MenuDay) => {
    setEditingDay(day.day);
    setEditedMeals({ ...day.meals });
  };

  const handleMenuSave = (day: string) => {
    if (editedMeals) {
      setWeeklyMenu(weeklyMenu.map(item => 
        item.day === day 
          ? { ...item, meals: editedMeals }
          : item
      ));
      setEditingDay(null);
      setEditedMeals(null);
    }
  };

  const handleMenuCancel = () => {
    setEditingDay(null);
    setEditedMeals(null);
  };

  const handleMealChange = (mealType: keyof Meals, value: string) => {
    if (editedMeals) {
      setEditedMeals({
        ...editedMeals,
        [mealType]: value.split(',').map(item => item.trim())
      });
    }
  };

  // Calculate stats
  const stats = [
    { 
      title: "Total Items", 
      value: menuItems.length.toString(), 
      icon: Restaurant, 
      description: "Menu Items" 
    },
    { 
      title: "Available Now", 
      value: `${Math.round((menuItems.filter(i => i.available).length / menuItems.length) * 100)}%`, 
      icon: Timer, 
      description: "Currently Available" 
    },
    { 
      title: "Most Popular", 
      value: menuItems.reduce((max, item) => Math.max(max, item.popularity), 0).toFixed(1), 
      icon: TrendingUp, 
      description: "Average Rating" 
    },
    { 
      title: "Categories", 
      value: new Set(menuItems.map(i => i.category)).size.toString(), 
      icon: LocalDining, 
      description: "Different Categories" 
    },
  ];

  // Filter items based on search
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A4A40] text-white font-clash">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-black/20 to-[#0A4A40]">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowBack className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold text-primary">
              Food Menu Management
            </h1>
            <ProfileMenu />
          </div>
          
          {/* Search and Filter */}
          <div className="mt-8 flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search menu items..."
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
              <div
                key={index}
                className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                    <p className="text-white/60">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-white/60">
              Showing {filteredItems.length} of {menuItems.length} items
            </span>
            <button
              onClick={() => {
                setSelectedItem({
                  id: `new-${Date.now()}`,
                  name: '',
                  type: 'breakfast',
                  category: 'veg',
                  price: 0,
                  available: true,
                  description: '',
                  allergens: [],
                  popularity: 0
                });
                setIsEditOpen(true);
              }}
              className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-2"
            >
              <Add className="h-5 w-5" />
              Add New Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => {
                  setSelectedItem(item);
                  setIsEditOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Weekly Menu Schedule</h2>
          <div className="grid gap-6">
            {weeklyMenu.map((dayMenu) => (
              <div key={dayMenu.day} className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-primary">{dayMenu.day}</h3>
                  {editingDay === dayMenu.day ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleMenuSave(dayMenu.day)}
                        className="p-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleMenuCancel}
                        className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                      >
                        <Cancel className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMenuEdit(dayMenu)}
                      className="p-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {editingDay === dayMenu.day && editedMeals ? (
                  <div className="space-y-4">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                      <div key={mealType}>
                        <label className="block font-medium capitalize mb-2 text-primary">
                          {mealType}
                        </label>
                        <textarea
                          value={editedMeals[mealType].join(', ')}
                          onChange={(e) => handleMealChange(mealType, e.target.value)}
                          className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                      <div key={mealType}>
                        <h4 className="font-medium capitalize text-primary">{mealType}</h4>
                        <p className="text-white/80">
                          {dayMenu.meals[mealType].join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <MenuEditModal
        item={selectedItem}
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}
