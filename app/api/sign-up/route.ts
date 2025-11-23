import dbConnect from "@/src/lib/dbConnect";
import userModel from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/src/helpers/sendVerificationEmail";

const POST = async(request: Request) => {
    await dbConnect()

    try {
        
    } catch (error) {
        console.log("Error registering user", error)

        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}

export { POST }