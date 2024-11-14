'use client';

import { useState, MouseEvent } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

// Mock data - replace with actual API calls
const attendanceData = {
  weekly: { present: 4, absent: 1 },
  monthly: { present: 18, absent: 4 },
  yearly: { present: 210, absent: 30 }
};

const COLORS = ['#00C49F', '#FF8042'];

// Update the type definition to match react-calendar's Value type
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Add this mock data near other data constants
const averageAttendanceData = [
  { month: 'Aug', attendance: 92, average: 88 },
  { month: 'Sep', attendance: 88, average: 87 },
  { month: 'Oct', attendance: 95, average: 89 },
  { month: 'Nov', attendance: 85, average: 86 },
  { month: 'Dec', attendance: 78, average: 84 },
  { month: 'Jan', attendance: 89, average: 85 },
  { month: 'Feb', attendance: 91, average: 88 },
  { month: 'Mar', attendance: 87, average: 86 },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  
  // Mock absent dates - replace with actual data
  const absentDates = ['2024-03-10', '2024-03-15', '2024-03-22'];

  const calculatePercentage = (present: number, total: number) => {
    return ((present / total) * 100).toFixed(1);
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    return absentDates.includes(dateString) ? 'absent-day' : '';
  };

  // Update the handler to remove explicit typing
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    setSelectedDate(value);
  };

  return (
    <div className="min-h-screen bg-background text-white font-clash">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link href="/student/dashboard">
          <Button variant="ghost" className="text-white hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-primary-dark/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-8 text-primary font-clash">
              Attendance Calendar
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
              Track and manage your attendance records
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="relative z-10 -mt-16 mb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <Calendar 
                onChange={handleDateChange}
                value={selectedDate}
                className="mx-auto bg-transparent border-none"
                tileClassName={tileClassName}
              />
            </div>
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-lg font-medium text-white/80 mb-4">Absent Dates</h3>
              <div className="space-y-2">
                {absentDates.map((date) => (
                  <div key={date} className="p-2 text-white/80">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Average Attendance Trend */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weekly Stats */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-lg font-medium text-white/80 mb-4">Weekly Attendance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: attendanceData.weekly.present },
                        { name: 'Absent', value: attendanceData.weekly.absent }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {calculatePercentage(attendanceData.weekly.present, 
                    attendanceData.weekly.present + attendanceData.weekly.absent)}%
                </p>
                <p className="text-sm text-white/60">Present Rate</p>
              </div>
              <div className="flex justify-center mt-4 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#00C49F] mr-2"></div>
                  <span className="text-sm text-white/60">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></div>
                  <span className="text-sm text-white/60">Absent</span>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-lg font-medium text-white/80 mb-4">Monthly Attendance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: attendanceData.monthly.present },
                        { name: 'Absent', value: attendanceData.monthly.absent }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {calculatePercentage(attendanceData.monthly.present,
                    attendanceData.monthly.present + attendanceData.monthly.absent)}%
                </p>
                <p className="text-sm text-white/60">Present Rate</p>
              </div>
              <div className="flex justify-center mt-4 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#00C49F] mr-2"></div>
                  <span className="text-sm text-white/60">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></div>
                  <span className="text-sm text-white/60">Absent</span>
                </div>
              </div>
            </div>

            {/* Yearly Stats */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
              <h3 className="text-lg font-medium text-white/80 mb-4">Yearly Attendance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: attendanceData.yearly.present },
                        { name: 'Absent', value: attendanceData.yearly.absent }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {calculatePercentage(attendanceData.yearly.present,
                    attendanceData.yearly.present + attendanceData.yearly.absent)}%
                </p>
                <p className="text-sm text-white/60">Present Rate</p>
              </div>
              <div className="flex justify-center mt-4 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#00C49F] mr-2"></div>
                  <span className="text-sm text-white/60">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></div>
                  <span className="text-sm text-white/60">Absent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance Trend */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <h3 className="text-lg font-medium text-white/80 mb-6">Attendance Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={averageAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)"
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    domain={[70, 100]}
                    ticks={[70, 75, 80, 85, 90, 95, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    name="Your Attendance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#FF8042" 
                    strokeWidth={2}
                    name="Hostel Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-6 gap-6">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#00C49F] mr-2"></div>
                <span className="text-sm text-white/60">Your Attendance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></div>
                <span className="text-sm text-white/60">Hostel Average</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <p className="text-white/80">
              Minimum hostel attendance of 75% is required to maintain your residency status.
              Please ensure regular check-ins at the hostel.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Student Hostel Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
