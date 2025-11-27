import dbConnect from "@/src/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import authOptions from "../../auth/[...nextauth]/options"
import userModel from "@/src/models/user.model"

const DELETE = async(request: Request, { params }: { params: { messageId: string }}) => {
    const messageId = params.messageId
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    try {
        const updatedResult = await userModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )

        if(updatedResult.modifiedCount === 0)
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {
                    status: 401
                }
            )

        return Response.json(
            {
                success: true,
                message: "Message Deleted"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Something went wrong while deleting message")

        return Response.json(
            {
                success: false,
                message: "Someting went wrong while deleting message"
            },
            {
                status: 500
            }
        )
    }
}

export { DELETE }