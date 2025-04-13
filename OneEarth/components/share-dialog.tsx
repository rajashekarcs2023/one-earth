"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Facebook, Twitter, Linkedin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  reportId: string
  title: string
}

export default function ShareDialog({ reportId, title }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const shareUrl = `https://infrawatch.example.com/report/${reportId}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied",
      description: "The report link has been copied to your clipboard.",
    })
  }

  const handleShare = (platform: string) => {
    // Mock share functionality
    toast({
      title: `Sharing to ${platform}`,
      description: "This would open a share dialog in a real app.",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">Help spread awareness about this environmental issue</div>

          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 p-2 rounded flex-1 text-xs truncate">{shareUrl}</div>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-blue-50"
              onClick={() => handleShare("Facebook")}
            >
              <Facebook className="h-5 w-5 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-blue-50"
              onClick={() => handleShare("Twitter")}
            >
              <Twitter className="h-5 w-5 text-blue-400" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-blue-50"
              onClick={() => handleShare("LinkedIn")}
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
