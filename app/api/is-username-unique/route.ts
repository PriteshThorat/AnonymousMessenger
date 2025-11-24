import dbConnect from "@/src/lib/dbConnect";
import userModel from "@/src/models/user.model";
import { z } from 'zod'
import { usernameValidation } from "@/src/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

const GET = async(request: Request) => {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
                },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data
        
        const exitingVerifiedUser = await userModel.findOne({
            username,
            isVerified: true
        })

        if(exitingVerifiedUser)
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 400
            }
        )
    } catch (error) {
        console.error("Error checking username", error)

        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
}

export { GET }