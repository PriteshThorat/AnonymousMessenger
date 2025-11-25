import { getServerSession } from 'next-auth'
import authOptions from '../auth/[...nextauth]/options'
import dbConnect from '@/src/lib/dbConnect'
import userModel from '@/src/models/user.model'
import { User } from 'next-auth'

const POST = async(request: Request) => {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if(!session || !user)
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessages
            },
            {
                new: true
            }
        )

        if(!updatedUser)
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages")

        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 401
            }
        )
    }
}

const GET = async(request: Request) => {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !user)
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )

    try {
        const userId = user._id
        const foundUser = await userModel.findById(userId)
    
        if(!foundUser)
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
    
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error at fetching user status")

        return Response.json(
            {
                success: false,
                message: "Error at fetching user status"
            },
            {
                status: 500
            }
        )
    }
}

export { POST, GET }