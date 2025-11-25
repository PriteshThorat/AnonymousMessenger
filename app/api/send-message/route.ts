import dbConnect from "@/src/lib/dbConnect"
import userModel from "@/src/models/user.model"
import { Message } from "@/src/models/user.model"

const POST = async(request: Request) => {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({ username })

        if(!user)
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )

        if(!user.isAcceptingMessages)
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                {
                    status: 403
                }
            )

        const newMessage = { content, createdAt: new Date() }

        user.message.push(newMessage as Message)

        await user.save() 

        return Response.json(
            {
                success: true,
                message: "Messsage send successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error at sending Message")
        
        return Response.json(
            {
                success: false,
                message: "Error at sending message"
            },
            {
                status: 500
            }
        )
    }
}

export { POST }