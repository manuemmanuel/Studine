import { Button } from "@/components/ui/button"
import { 
  Calendar, Utensils, Coffee, 
  Sun, Moon, ArrowLeft
} from 'lucide-react'
import Link from "next/link"

export default function MenuPage() {
  const weeklyMenu = [
    {
      day: "Monday",
      meals: {
        breakfast: ["Idli", "Sambar", "Chutney", "Coffee/Tea"],
        lunch: ["Rice", "Dal", "Mixed Veg Curry", "Curd", "Pickle"],
        dinner: ["Chapati", "Paneer Butter Masala", "Rice", "Dal"]
      }
    },
    {
      day: "Tuesday",
      meals: {
        breakfast: ["Poha", "Boiled Eggs", "Fruit", "Coffee/Tea"],
        lunch: ["Rice", "Rajma", "Aloo Gobi", "Curd", "Pickle"],
        dinner: ["Chapati", "Chicken Curry", "Rice", "Dal"]
      }
    },
    {
      day: "Wednesday",
      meals: {
        breakfast: ["Dosa", "Sambar", "Coconut Chutney", "Coffee/Tea"],
        lunch: ["Rice", "Dal Fry", "Bhindi Masala", "Curd", "Pickle"],
        dinner: ["Chapati", "Egg Curry", "Rice", "Dal Tadka"]
      }
    },
    {
      day: "Thursday",
      meals: {
        breakfast: ["Upma", "Boiled Eggs", "Banana", "Coffee/Tea"],
        lunch: ["Rice", "Chana Dal", "Cabbage Poriyal", "Curd", "Pickle"],
        dinner: ["Chapati", "Mixed Veg Curry", "Rice", "Dal"]
      }
    },
    {
      day: "Friday",
      meals: {
        breakfast: ["Puri", "Aloo Bhaji", "Fruit", "Coffee/Tea"],
        lunch: ["Rice", "Sambar", "Potato Fry", "Curd", "Pickle"],
        dinner: ["Chapati", "Fish Curry", "Rice", "Dal"]
      }
    },
    {
      day: "Saturday",
      meals: {
        breakfast: ["Uttapam", "Sambar", "Tomato Chutney", "Coffee/Tea"],
        lunch: ["Rice", "Dal", "Palak Paneer", "Curd", "Pickle"],
        dinner: ["Chapati", "Mushroom Masala", "Rice", "Dal"]
      }
    },
    {
      day: "Sunday",
      meals: {
        breakfast: ["Vada", "Sambar", "Coconut Chutney", "Coffee/Tea"],
        lunch: ["Veg Biryani", "Raita", "Salan", "Pickle"],
        dinner: ["Chapati", "Mutton Curry", "Rice", "Dal"]
      }
    }
  ]

  const mealTimes = [
    { meal: "Breakfast", icon: Coffee, time: "7:30 AM - 9:30 AM" },
    { meal: "Lunch", icon: Sun, time: "12:30 PM - 2:30 PM" },
    { meal: "Dinner", icon: Moon, time: "7:30 PM - 9:30 PM" }
  ]

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
              Weekly Menu
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-clash">
              Plan your meals for the week and manage your bookings
            </p>
          </div>
        </div>
      </section>

      {/* Meal Timings */}
      <section className="relative z-10 -mt-16 mb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealTimes.map((meal, index) => (
              <div key={index} className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg backdrop-blur-sm">
                    <meal.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white/80">{meal.meal}</h3>
                    <p className="text-sm text-white/60">{meal.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Menu */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {weeklyMenu.map((day, index) => (
              <div key={index} className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold text-primary mb-6">{day.day}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(day.meals).map(([mealType, items], idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-white/90 capitalize">{mealType}</h4>
                      </div>
                      <ul className="space-y-2 text-white/70">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-center">
                            <Utensils className="w-4 h-4 mr-2 text-primary/60" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Note */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg border border-white/20">
            <p className="text-white/80">
              This menu is subject to change based on student suggestions and seasonal availability. 
              Please share your feedback with the mess committee to help us improve the menu.
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
  )
}
