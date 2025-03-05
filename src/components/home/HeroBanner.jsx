import React from 'react'
import { Button } from '@heroui/button'
import { useRouter } from 'next/navigation'

const HeroBanner = () => {
  const router = useRouter() // Initialize the Next.js router

  // Handle button press to navigate to /categories
  const handlePress = (e) => {
    console.log('Button pressed!', e)
    router.push('/categories') // Programmatically navigate to /categories
  }
  return (
    <section className="hero-banner relative bg-cover bg-center bg-no-repeat h-[60vh] md:h-[70vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/el-salvador.jpg')`, // Update with the actual path to your image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content */}
      <div className="container relative z-10 mt-">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Text */}
          <div className="text-white">
            <h1 className="text-4xl  md:text-6xl font-bold font-sans mb-4">
              <strong>
                Every treasure whispers a memory, every find lights the way home
              </strong>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              Step into the past with every item—crafted to bring the warmth,
              joy, and stories of home to your life, one discovery at a time.
            </p>

            <Button
              onPress={handlePress} // Handle button press for navigation to /categories
              className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 rounded-full transition-colors"
            >
              Shop Now
            </Button>
          </div>

          {/* Right Column: (Optional) Could add more content or leave empty */}
          <div className="hero-banner__image hidden md:block">
            {/* You can add additional content or leave this empty */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
