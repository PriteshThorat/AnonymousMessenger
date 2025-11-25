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
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 relative z-10 animate-fade-in">
                {/* Icon header */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative bg-linear-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient'>
                        Verification Code
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        <p className='text-sm font-medium'>
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
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200">Verification Code</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="Enter 6-digit code"
                                    className="h-12 text-center text-lg tracking-widest font-mono bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    maxLength={6}
                                    { ...field } />
                                </FormControl>
                                <FormMessage className="text-xs"/>
                            </FormItem>
                        )} />
                        <Button
                        type="submit"
                        className="w-full h-12 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] rounded-xl" >
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            Verify Account
                        </Button>
                    </form>
                </Form>

                {/* Footer hint */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Didn't receive the code? Check your spam folder
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Verify