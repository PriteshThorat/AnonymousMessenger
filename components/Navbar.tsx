"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="shadow-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-black/80">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                        Anonymous Messenger
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {
                            session ? (
                                <>
                                    <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-[150px] sm:max-w-none truncate">
                                        Welcome, <span className="font-semibold text-purple-600 dark:text-white">{ user.username?.toUpperCase() || user.email?.toUpperCase() }</span>
                                    </span>
                                    <Button 
                                    onClick={() => signOut()}
                                    className="bg-linear-to-r from-red-500 to-pink-500 dark:from-gray-800 dark:to-black hover:from-red-600 hover:to-pink-600 dark:hover:from-gray-700 dark:hover:to-gray-900 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10">
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in">
                                    <Button className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-white dark:to-gray-200 hover:from-blue-700 hover:to-purple-700 dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-black font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10">
                                        Log In
                                    </Button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar