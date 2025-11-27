"use client"

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/src/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckigUsername, setIsCheckigUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced: any = useDebounceCallback(setUsername, 300)
    
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        (async() => {
            if(username){
                setIsCheckigUsername(true)
                setUsernameMessage('')

                try {
                    const res = await axios.get(`/api/is-username-unique?username=${username}`)

                    setUsernameMessage(res.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError?.response?.data?.message ?? "Error Checking Username")
                } finally {
                    setIsCheckigUsername(false)
                }
            }
        })()
    }, [debounced])

    const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            const res = await axios.post("/api/sign-up", data)

            toast.success("Success", {
                description: res.data.message
            })

            router.replace(`/verify/${username}`)
        } catch (error) {
            console.log("Error in signup of user")
            
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError?.response?.data?.message

            toast.error("Sign Up Failed", {
                description: errorMessage
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="w-full max-w-md p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center space-y-2">
                    <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        Join Anonymous Messenger
                    </h1>
                    <p className='text-gray-600 text-xs sm:text-sm'>
                        Sign up to start sending anonymous messages
                    </p>
                </div>
                <Form { ...form }>
                    <form 
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="Choose a username"
                                    className="focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    { ...field }
                                    onChange={e => {
                                        field.onChange(e)
                                        debounced(e.target.value)
                                    }} />
                                </FormControl>
                                <div className="flex items-center gap-2 min-h-5">
                                    {isCheckigUsername && <Loader2 className='h-4 w-4 animate-spin text-gray-400'/>}
                                    {usernameMessage && (
                                        <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-600 font-medium" : "text-red-600"}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )} >
                        </FormField>
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="email"
                                    placeholder="your@email.com"
                                    className="focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} >
                        </FormField>
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                <FormControl>
                                    <Input 
                                    type="password"
                                    placeholder="Enter a secure password"
                                    className="focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        disabled={isSubmitting} >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please wait
                                    </>
                                ) : "Sign Up"
                            }
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p className="text-sm text-gray-600">
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline-offset-4 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp