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
        const document = await userModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: '$message'
            },
            {
                $sort: {
                    'message.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    message: {
                        $push: '$message'
                    }
                }
            }
        ])

        if(!document || document.length === 0)
            return Response.json(
                {
                    success: false,
                    message: "User has no messages"
                },
                {
                    status: 404
                }
            )

        return Response.json(
            {
                success: true,
                messages: document[0].message
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