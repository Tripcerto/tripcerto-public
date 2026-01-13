import { Plane, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">TripCerto</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making travel planning simple, enjoyable, and accessible for everyone.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition">Features</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Destinations</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Mobile App</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition">About Us</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Careers</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
          <p>&copy; 2026 TripCerto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
