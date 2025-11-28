"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import messages from '../messages.json'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-gray-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent animate-gradient leading-tight">
            Dive into the World of
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-3 sm:mb-4 bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-gray-200 dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent animate-gradient">
            Anonymous Messenger
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-4 sm:mt-6 font-medium px-4">
            Share your thoughts freely, receive honest feedback, and connect authentically without revealing your identity.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="w-full max-w-4xl px-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">
            What People Are Saying
          </h3>
          <Carousel 
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
            <CarouselContent>
              {
                messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <Card className="bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-2 border-gray-200 dark:border-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden">
                        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 pb-3 sm:pb-4 border-b-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">{message.title}</h4>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-[180px] sm:min-h-[220px] md:min-h-[250px]">
                          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center leading-relaxed">
                            {message.content}
                          </p>
                        </CardContent>
                        <CardFooter className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-900 pt-3 sm:pt-4 border-t-2 border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mx-auto">
                            📩 {message.received}
                          </p>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-black shadow-lg -left-2 sm:-left-12" />
            <CarouselNext className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-black shadow-lg -right-2 sm:-right-12" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}