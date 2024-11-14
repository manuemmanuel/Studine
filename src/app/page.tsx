'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Zap, Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState('student')

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    // For guest users, directly navigate without checking credentials
    if (userType === 'guest') {
      setTimeout(() => {
        setIsLoading(false)
        router.push('/guest/dashboard')
      }, 1000)
      return
    }

    // Get form data
    const form = event.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    // Validate credentials based on user type
    const isValidCredentials = 
      (userType === 'student' && email === 'student@gmail.com' && password === 'student') ||
      (userType === 'management' && email === 'management@gmail.com' && password === 'management')

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (isValidCredentials) {
        // Navigate to respective homepage based on user type
        if (userType === 'student') {
          router.push('/student/dashboard')
        } else if (userType === 'management') {
          router.push('/management/dashboard')
        } else {
          router.push('/guest/dashboard')
        }
      } else {
        setError('Invalid credentials. Please try again.')
      }
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the hostel management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <RadioGroup 
                defaultValue="student" 
                className="grid grid-cols-3 gap-4"
                onValueChange={setUserType}
              >
                <div>
                  <RadioGroupItem value="student" id="student" className="peer sr-only" />
                  <Label
                    htmlFor="student"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Icons.user className="mb-3 h-6 w-6" />
                    Student
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="management" id="management" className="peer sr-only" />
                  <Label
                    htmlFor="management"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Icons.building2 className="mb-3 h-6 w-6" />
                    Management
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="guest" id="guest" className="peer sr-only" />
                  <Label
                    htmlFor="guest"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Icons.userPlus className="mb-3 h-6 w-6" />
                    Guest
                  </Label>
                </div>
              </RadioGroup>
              {userType !== 'guest' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required={userType !== 'guest'} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required={userType !== 'guest'} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                </>
              )}
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}