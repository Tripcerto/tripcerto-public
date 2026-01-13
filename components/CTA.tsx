import InterestForm from './InterestForm'

export default function CTA() {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Ready to start your adventure?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripCerto to make their dream trips a reality.
            Register your interest and be the first to know when we launch.
          </p>
        </div>

        <div className="flex justify-center">
          <InterestForm />
        </div>
      </div>
    </div>
  )
}
