'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, LogOut, User, Settings, Bell } from "lucide-react"

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="h-6 w-6 text-primary" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 bg-background/95 backdrop-blur-sm border-white/20">
        <DropdownMenuLabel className="text-white/70">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-white/60">john.doe@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-primary/20 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-primary/20 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-primary/20 cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 