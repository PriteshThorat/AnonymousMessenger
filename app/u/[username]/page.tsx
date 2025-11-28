"use client"

import { useParams } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/src/types/ApiResponse"
import { toast } from "sonner"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"

const SendMessage = () => {
    const params = useParams<{ username: string }>()

    const [suggestedMessages, setSuggestedMessages] = useState(["If you could instantly learn any new skill, what would it be and why?", "What's a fictional world you'd love to visit, and what would you do there?", "What's a piece of advice you received that has stuck with you?"])

    const form = useForm({
        defaultValues: {
            content: ''
        }
    })

    const onSubmit = async(data: any) => {
        try {
            const res = await axios.post('/api/send-message', {
                username: params.username,
                content: data.content
            })

            toast.success("Success", {
                description: res?.data?.message
            })
        } catch (error) {
            console.log("Error while sending message")

            const axiosError = error as AxiosError<ApiResponse>

            toast.error("Error", {
                description: axiosError?.response?.data?.message || "Failed while sending message"
            })
        } finally {
            form.reset()
        }
    }

    const suggestMessage = async() => {
        try {
            const res = await axios.get('/api/suggest-messages')

            const messages = res?.data?.messages.split("||")
            setSuggestedMessages(messages)

            toast.success("Suggested messages updated")
        } catch (error) {
            console.log("Error while suggesting messages")

            const axiosError = error as AxiosError<ApiResponse>

            toast.error("Error", {
                description: axiosError?.response?.data?.message || "Failed while suggesting messages"
            })
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-gray-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
                <div className="w-full max-w-2xl space-y-8">
                    {/* Header Section */}
                    <div className="text-center mb-6 md:mb-8 animate-fade-in px-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 md:mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                            Public Profile
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium wrap-break-word">
                            Send an anonymous message to @{params.username}
                        </p>
                    </div>

                    {/* Message Form Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 sm:p-6 md:p-8 animate-fade-in">
                        <Form { ...form }>
                            <form 
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                                <span className="text-xl sm:text-2xl">💬</span> Send Anonymous Message
                                            </FormLabel>
                                            <FormControl>
                                                <textarea
                                                    placeholder="Type your anonymous message here..."
                                                    className="w-full min-h-[120px] sm:min-h-[150px] p-3 sm:p-4 text-sm sm:text-base bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 focus:border-purple-500 dark:focus:border-white focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-white/20 transition-all duration-200 rounded-lg sm:rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm"/>
                                        </FormItem>
                                    )} />
                                <Button
                                    type="submit"
                                    className="w-full h-11 sm:h-12 text-sm sm:text-base bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-200 dark:to-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-gray-200 dark:hover:via-gray-300 dark:hover:to-gray-200 text-white dark:text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-lg sm:rounded-xl" >
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Suggested Messages Section */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-4 sm:p-6 md:p-8 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="text-xl sm:text-2xl">💡</span> <span className="wrap-break-word">Suggested Messages</span>
                            </h2>
                            <Button 
                                onClick={suggestMessage}
                                variant="outline"
                                className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-pink-500 dark:from-white dark:to-gray-200 hover:from-purple-600 hover:to-pink-600 dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-black border-0 font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-lg sm:rounded-xl text-sm sm:text-base px-4 sm:px-6 h-10 sm:h-auto whitespace-nowrap">
                                Refresh Ideas
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {
                                suggestedMessages.map((message, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            form.setValue('content', message)
                                        }}
                                        className="w-full text-left p-3 sm:p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-black hover:from-purple-100 hover:to-pink-100 dark:hover:from-black dark:hover:to-gray-900 border-2 border-purple-200 dark:border-gray-800 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium group-hover:text-purple-700 dark:group-hover:text-white transition-colors wrap-break-word">
                                            {message}
                                        </p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendMessage