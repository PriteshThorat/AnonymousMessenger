import verificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import resend from "../lib/resend";

const sendVerificationEmail = async(email: string, username: string, verifyCode: string): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'Pritesh <me@priteshthorat.me>',
            to: email,
            subject: 'Anyonymous Message | Verification Code',
            react: verificationEmail({ username, otp: verifyCode}),
        });

        return { success: true, message: "Verification Email sent successfully"}
    } catch (error) {
        console.log("Error sending verification email", error)

        return { success: false, message: "Failed to send verification email"}
    }
}

export default sendVerificationEmail