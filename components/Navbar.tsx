"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
                        Mystery Message
                    </a>
                    <div className="flex items-center gap-4">
                        {
                            session ? (
                                <>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        Welcome, <span className="font-semibold text-purple-600 dark:text-purple-400">{ user.username?.toUpperCase() || user.email?.toUpperCase() }</span>
                                    </span>
                                    <Button 
                                    onClick={() => signOut()}
                                    className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in">
                                    <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200">
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