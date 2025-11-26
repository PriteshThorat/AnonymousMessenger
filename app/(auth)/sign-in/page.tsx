"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/src/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const SignIn = () => {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if(result?.error)
            toast.error("Login Failed", {
                description: "Incorrect username or password"
            })

        if(result?.url)
            router.replace('/dashboard')
    }

    return (
            <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center space-y-2">
                        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            Join Anonymous Messenger
                        </h1>
                        <p className='text-gray-600 text-sm'>
                            Sign In to start sending anonymous messages
                        </p>
                    </div>
                    <Form { ...form }>
                        <form 
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Username / Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                        placeholder="Enter Username or Email"
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
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg" >
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        )
}

export default SignIn