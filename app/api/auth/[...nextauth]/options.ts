import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from '@/src/lib/dbConnect'
import userModel from '@/src/models/user.model'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import { JWT } from "next-auth"

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    lable: "Email",
                    type: "text"
                },
                password: {
                    lable: "Password",
                    type: "password"
                }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()

                try {
                    const user = await userModel.findOne({
                        $or: [
                            {
                                email: credentials.identifier,
                                username: credentials.identifier
                            }
                        ]
                    })

                    if(!user)
                        throw new Error("No user found with this email")

                    if(!user.isVerified)
                        throw new Error("Verify your email before login")

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect)
                        return user
                    else
                        throw new Error("Incorrect password")
                } catch (error: any){
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({ session, token }){
            const typedToken = token as JWT

            if(token){
                session.user._id = typedToken?._id
                session.user.isVerified = typedToken.isVerified
                session.user.isAcceptingMessages = typedToken.isAcceptingMessages
                session.user.username = typedToken.username
            }

            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}

export default authOptions