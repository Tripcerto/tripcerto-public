import { Plane, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">TripCerto</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition">About</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">Contact</a>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
            Plan Your Perfect
            <span className="block text-primary-600">Journey</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Discover amazing destinations, create detailed itineraries, and experience unforgettable adventures.
            Your next great trip starts here with TripCerto.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl flex items-center">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-md border border-gray-200">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-primary-600">50K+</div>
              <div className="text-gray-600 mt-1">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">180+</div>
              <div className="text-gray-600 mt-1">Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">98%</div>
              <div className="text-gray-600 mt-1">Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
