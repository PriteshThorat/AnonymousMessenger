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
        <Card className="bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl overflow-hidden">
            <CardHeader className="relative bbg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200 leading-relaxed flex-1 whitespace-pre-wrap wrap-break-word">
                        {message.content}
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant={"destructive"} 
                                size="icon"
                                className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl shrink-0 h-9 w-9">
                                <X className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                                    This action cannot be undone. This will permanently delete this message from your dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-3 sm:gap-3">
                                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold transition-all duration-200">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDeleteConfirm()}
                                    className="bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-xl">
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