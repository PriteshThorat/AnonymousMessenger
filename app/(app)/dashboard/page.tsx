"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/src/models/user.model"
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema"
import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter(message => message._id.toString() !== messageId))
    }

    const { data: session } = useSession()

    const user = session?.user as User
    const username = user?.username
    const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)

        toast.success("URL Copied", {
            description: "Profile URL has been copied to clipboard"
        })
    }

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async() => {
        setIsSwitchLoading(true)

        try {
            const res = await axios.get('/api/accept-messages')

            setValue('acceptMessages', res?.data?.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast.error("Error", {
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async(refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const res = await axios.get('/api/get-message')

            setMessages(res.data.messages || [])

            if(refresh){
                toast.success("Refreshed Messages", {
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast.error("Error", {
                description: axiosError.response?.data?.message || "Failed to fetch message settings"
            })
        }finally {
            setIsLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user)
            return

        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async() => {
        try {
            const res = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })

            setValue('acceptMessages', !acceptMessages)
            toast.success(res.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast.error("Error", {
                description: axiosError.response?.data?.message || "Failed to fetch message settings"
            })
        }
    }

    if(!session || !session.user)
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
                <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please Log In to continue</p>
                </div>
            </div>
        )

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 py-8">
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-6xl animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">User Dashboard</h1>

                <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-blue-200 dark:border-gray-600 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-2xl">🔗</span> Copy Your Unique Link
                    </h2>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="flex-1 p-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none shadow-inner"
                        />
                        <Button 
                            onClick={copyToClipboard}
                            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 px-6">
                            Copy
                        </Button>
                    </div>
                </div>

                <div className="mb-8 p-6 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-purple-200 dark:border-gray-600 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className="data-[state=checked]:bg-linear-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                            />
                            <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                Accept Messages: <span className={`font-bold ${acceptMessages ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{acceptMessages ? 'On' : 'Off'}</span>
                            </span>
                        </div>
                        {isSwitchLoading && <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />}
                    </div>
                </div>

                <Separator className="my-8 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent h-px" />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Messages</h2>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message._id.toString()}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 px-6 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-500">
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">No messages to display yet.</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Share your unique link to start receiving messages!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard