"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from "@/src/schemas/verifySchema"
import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Mail, ShieldCheck } from "lucide-react"

const Verify = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            toast.success("Success", {
                description: res?.data?.message
            })

            router.replace('/sign-in')
        } catch (error) {
            console.log("Error in signup of user")
                        
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError?.response?.data?.message

            toast.error("Sign Up Failed", {
                description: errorMessage
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden px-4 py-8">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-gray-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-gray-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 relative z-10 animate-fade-in">
                {/* Icon header */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 dark:from-white dark:to-gray-200 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative bg-linear-to-r from-blue-600 to-purple-600 dark:from-white dark:to-gray-200 p-3 sm:p-4 rounded-full">
                            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-black" />
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent animate-gradient'>
                        Verification Code
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <p className='text-xs sm:text-sm font-medium'>
                            Enter the code sent to your email
                        </p>
                    </div>
                </div>

                <Form { ...form }>
                    <form 
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-white">Verification Code</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="Enter 6-digit code"
                                    className="h-12 text-center text-lg tracking-widest font-mono bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 focus:border-purple-500 dark:focus:border-white focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-white/20 transition-all duration-200 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    maxLength={6}
                                    { ...field } />
                                </FormControl>
                                <FormMessage className="text-xs"/>
                            </FormItem>
                        )} />
                        <Button
                        type="submit"
                        className="w-full h-12 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-white dark:via-gray-200 dark:to-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-gray-200 dark:hover:via-gray-300 dark:hover:to-gray-200 text-white dark:text-black font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-xl" >
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            Verify Account
                        </Button>
                    </form>
                </Form>

                {/* Footer hint */}
                <div className="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Didn't receive the code? Check your spam folder
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Verify