"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from "@/src/models/user.model"
import axios from "axios"
import { toast } from "sonner"

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async() => {
        const res = await axios.delete(`/api/delete-message/${message._id}`)

        toast.success(res?.data.message)

        onMessageDelete(message?._id.toString())
    }

    return (
        <Card className="bg-linear-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl sm:rounded-2xl overflow-hidden">
            <CardHeader className="relative bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 leading-relaxed flex-1 whitespace-pre-wrap wrap-break-word">
                        {message.content}
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant={"destructive"} 
                                size="icon"
                                className="bg-linear-to-r from-red-500 to-pink-500 dark:from-gray-800 dark:to-black hover:from-red-600 hover:to-pink-600 dark:hover:from-gray-700 dark:hover:to-gray-900 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg sm:rounded-xl shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                                <X className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-[90vw] sm:max-w-lg">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                                    This action cannot be undone. This will permanently delete this message from your dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row">
                                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-800 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base w-full sm:w-auto">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDeleteConfirm()}
                                    className="bg-linear-to-r from-red-500 to-pink-500 dark:from-white dark:to-gray-200 hover:from-red-600 hover:to-pink-600 dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-black font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-lg sm:rounded-xl text-sm sm:text-base w-full sm:w-auto">
                                    Delete Message
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
        </Card>
    )
}

export default MessageCard