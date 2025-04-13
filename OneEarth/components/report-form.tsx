"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ReportFormData } from "@/types/report"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ReportForm() {
  const [formData, setFormData] = useState<ReportFormData>({
    image: null,
    severity: 3,
    notifyAuthority: false,
    description: "",
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [aiLabel, setAiLabel] = useState<string | null>(null)
  const [isLabelConfirmed, setIsLabelConfirmed] = useState<boolean>(false)
  const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false)
  const [customLabel, setCustomLabel] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, image: file })

      // Reset label states when a new image is uploaded
      setIsLabelConfirmed(false)
      setIsEditingLabel(false)
      setCustomLabel("")

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)

        // Mock AI label generation
        const labels = [
          "Illegal dumping near water body",
          "Factory emitting excessive smoke",
          "Unauthorized tree cutting in protected area",
          "Chemical spill in public area",
          "Air pollution from industrial source",
        ]

        setTimeout(() => {
          setAiLabel(labels[Math.floor(Math.random() * labels.length)])
        }, 1000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSeverityChange = (value: number[]) => {
    setFormData({ ...formData, severity: value[0] })
  }

  const handleNotifyChange = (checked: boolean) => {
    setFormData({ ...formData, notifyAuthority: checked })
  }

  const clearImage = () => {
    setFormData({ ...formData, image: null })
    setPreview(null)
    setAiLabel(null)
    setIsLabelConfirmed(false)
    setIsEditingLabel(false)
    setCustomLabel("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value })
  }

  const confirmLabel = () => {
    setIsLabelConfirmed(true)
    setIsEditingLabel(false)
    toast({
      title: "Label confirmed",
      description: "Thanks for confirming the AI analysis.",
    })
  }

  const rejectLabel = () => {
    setIsEditingLabel(true)
    setIsLabelConfirmed(false)
  }

  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLabel(e.target.value)
  }

  const saveCustomLabel = () => {
    if (customLabel.trim()) {
      setAiLabel(customLabel)
      setIsLabelConfirmed(true)
      setIsEditingLabel(false)
      toast({
        title: "Label updated",
        description: "Thanks for providing a more accurate label.",
      })
    } else {
      toast({
        title: "Label required",
        description: "Please enter a label for the environmental issue.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image && !preview) {
      toast({
        title: "Image required",
        description: "Please upload an image of the environmental issue",
        variant: "destructive",
      })
      return
    }

    if (!isLabelConfirmed && aiLabel) {
      toast({
        title: "Label confirmation required",
        description: "Please confirm or edit the AI analysis before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Mock location data (in a real app, we would use geolocation)
      const location = {
        lat: 40.7128 + Math.random() * 0.05,
        lng: -74.006 + Math.random() * 0.05,
      }

      // In a real app, we would upload the image to a storage service
      // and get a URL back. For now, we'll use the preview URL.
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: preview || "/polluted-riverbank.png",
          severity: formData.severity,
          notifyAuthority: formData.notifyAuthority,
          location,
          label: aiLabel,
          description: formData.description,
          type: getReportType(aiLabel || ""),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Show success toast with similar reports count and share button
        toast({
          title: "🎉 Report submitted!",
          description: (
            <div className="space-y-2">
              <p>{data.similarReports} others have reported similar issues nearby.</p>
              <button
                onClick={() => {
                  // Mock share functionality
                  toast({
                    title: "Sharing...",
                    description: "This would open a share dialog in a real app.",
                  })
                }}
                className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-200 transition-colors"
              >
                📣 Share this with your community
              </button>
            </div>
          ),
          duration: 5000,
        })

        // Reset form
        clearImage()
        setFormData({
          image: null,
          severity: 3,
          notifyAuthority: false,
          description: "",
        })

        // Navigate to the feed page to see the new report
        setTimeout(() => {
          router.push(`/feed?highlight=${data.report.id}`)
        }, 1500)
      } else {
        throw new Error("Failed to submit report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    const colors = ["bg-green-500", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"]
    return colors[severity - 1]
  }

  const getSeverityEmoji = (severity: number) => {
    const emojis = ["😊", "🙂", "😐", "🙁", "😡"]
    return emojis[severity - 1]
  }

  const getReportType = (label: string) => {
    const labelLower = label.toLowerCase()
    if (labelLower.includes("dump") || labelLower.includes("waste") || labelLower.includes("trash")) {
      return "Dumping"
    } else if (labelLower.includes("tree") || labelLower.includes("forest") || labelLower.includes("cutting")) {
      return "Deforestation"
    } else if (labelLower.includes("water") || labelLower.includes("river") || labelLower.includes("lake")) {
      return "Water Pollution"
    } else if (labelLower.includes("smoke") || labelLower.includes("air") || labelLower.includes("emission")) {
      return "Air Pollution"
    }
    return "Other"
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-emerald-50 rounded-t-lg">
        <CardTitle className="text-center text-emerald-800">See Something? Speak for Nature</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Upload Evidence</Label>

            {!preview ? (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center border-dashed border-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8 mb-2 text-emerald-600" />
                  <span className="text-xs">Take Photo</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center border-dashed border-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mb-2 text-emerald-600" />
                  <span className="text-xs">Upload Image</span>
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={clearImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* AI Label */}
          {aiLabel && !isLabelConfirmed && !isEditingLabel && (
            <div className="space-y-3">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">🧠 AI Analysis:</div>
                <div className="text-emerald-800 font-medium">{aiLabel}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center space-x-1 border-green-500 text-green-600 hover:bg-green-50"
                  onClick={confirmLabel}
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center space-x-1 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={rejectLabel}
                >
                  <X className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </div>
          )}

          {/* Custom Label Input */}
          {isEditingLabel && (
            <div className="space-y-3">
              <Label htmlFor="custom-label" className="text-sm font-medium">
                Enter correct label:
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="custom-label"
                  placeholder="e.g., Chemical waste dumping"
                  value={customLabel}
                  onChange={handleCustomLabelChange}
                  className="flex-1"
                />
                <Button type="button" onClick={saveCustomLabel}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Confirmed Label */}
          {isLabelConfirmed && aiLabel && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">🧠 Confirmed Label:</div>
              <div className="text-emerald-800 font-medium flex items-center">
                {aiLabel}
                <span className="ml-2 text-green-600">
                  <Check className="h-4 w-4" />
                </span>
              </div>
            </div>
          )}

          {/* Description Field */}
          {aiLabel && (
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Add a short description (optional)
              </Label>
              <textarea
                id="description"
                className="w-full min-h-[80px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. This waste has been here since last week near the bridge."
                value={formData.description}
                onChange={handleDescriptionChange}
              />
            </div>
          )}

          {/* Severity Slider */}
          {aiLabel && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Severity Level</Label>
                <div
                  className={`${getSeverityColor(
                    formData.severity,
                  )} text-white px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {getSeverityEmoji(formData.severity)} Level {formData.severity}
                </div>
              </div>

              <Slider
                defaultValue={[3]}
                max={5}
                min={1}
                step={1}
                onValueChange={handleSeverityChange}
                className="py-4"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>Minor</span>
                <span>Severe</span>
              </div>
            </div>
          )}

          {/* Notify Authority Toggle */}
          {aiLabel && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Notify Local Authority</Label>
                <p className="text-xs text-gray-500">Send this report to relevant officials</p>
              </div>
              <Switch checked={formData.notifyAuthority} onCheckedChange={handleNotifyChange} />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting || !isLabelConfirmed}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
