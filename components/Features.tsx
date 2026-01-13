import { Map, Calendar, Users, Shield, Globe, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Smart Itineraries',
    description: 'AI-powered trip planning that creates personalized itineraries based on your preferences and travel style.',
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Organize your travel dates, activities, and bookings all in one place with our intuitive calendar.',
  },
  {
    icon: Users,
    title: 'Group Travel',
    description: 'Collaborate with friends and family to plan the perfect group adventure together.',
  },
  {
    icon: Shield,
    title: 'Secure Bookings',
    description: 'Book with confidence knowing your payments and personal information are fully protected.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Explore destinations worldwide with verified local guides and authentic experiences.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Recommendations',
    description: 'Get tailored suggestions for hotels, restaurants, and activities that match your interests.',
  },
]

export default function Features() {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Everything you need for the perfect trip
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            TripCerto provides all the tools and features you need to plan, book, and enjoy amazing travel experiences.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="relative group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
