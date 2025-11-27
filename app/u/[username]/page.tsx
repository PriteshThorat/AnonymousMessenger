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
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
                <div className="w-full max-w-2xl space-y-8">
                    {/* Header Section */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Public Profile
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                            Send an anonymous message to @{params.username}
                        </p>
                    </div>

                    {/* Message Form Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 animate-fade-in">
                        <Form { ...form }>
                            <form 
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                <span className="text-2xl">💬</span> Send Anonymous Message
                                            </FormLabel>
                                            <FormControl>
                                                <textarea
                                                    placeholder="Type your anonymous message here..."
                                                    className="w-full min-h-[150px] p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm"/>
                                        </FormItem>
                                    )} />
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-xl" >
                                    <ShieldCheck className="w-5 h-5 mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Suggested Messages Section */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span className="text-2xl">💡</span> Suggested Messages
                            </h2>
                            <Button 
                                onClick={suggestMessage}
                                variant="outline"
                                className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-xl">
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
                                        className="w-full text-left p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 border-2 border-purple-200 dark:border-purple-700 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] group">
                                        <p className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
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