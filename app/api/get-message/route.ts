import dbConnect from "@/src/lib/dbConnect";
import userModel from "@/src/models/user.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { Types } from "mongoose";

const GET = async() => {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!user)
        return Response.json(
            {
                success: false,
                messsage: "Not Authenticated"
            },
            {
                status: 401
            }
        )

    const userId = new Types.ObjectId(user._id)

    try {
        const user = await userModel.aggregate([
            {
                $match: {
                    $id: userId
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ])

        if(!user || user.length === 0)
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
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error at getting messages")

        return Response.json(
            {
                success: false,
                message: "Error at getting messages"
            },
            {
                status: 500
            }
        )
    }
}

export { GET }