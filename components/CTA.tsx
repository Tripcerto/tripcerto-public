import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          Ready to start your adventure?
        </h2>
        <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
          Join thousands of travelers who trust TripCerto to make their dream trips a reality.
          Start planning your next journey today.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg flex items-center justify-center">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-primary-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-900 transition border border-primary-500">
            Talk to Sales
          </button>
        </div>
        <p className="mt-6 text-primary-200 text-sm">
          No credit card required • Free 14-day trial • Cancel anytime
        </p>
      </div>
    </div>
  )
}
