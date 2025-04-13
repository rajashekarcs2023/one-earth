"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, MapPin, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Report } from "@/types/report"

interface VerificationFlowProps {
  report: Report
  onClose: () => void
  onVerify: (reportId: string, description: string, photoBlob: Blob) => Promise<void>
}

export default function VerificationFlow({ report, onClose, onVerify }: VerificationFlowProps) {
  const [step, setStep] = useState<"location" | "photo" | "description" | "submitting">("location")
  const [locationStatus, setLocationStatus] = useState<"checking" | "success" | "error" | "denied">("checking")
  const [locationError, setLocationError] = useState<string | null>(null)
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Step 1: Check user's location
  useEffect(() => {
    if (step === "location") {
      checkLocation()
    }
  }, [step])

  // Step 2: Initialize camera when on photo step
  useEffect(() => {
    if (step === "photo") {
      initCamera()
      return () => {
        // Clean up camera stream when component unmounts or step changes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [step])

  const checkLocation = () => {
    setLocationStatus("checking")
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationStatus("error")
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Get user's coordinates
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude

        // Get report coordinates
        const reportLat = report.location.lat
        const reportLng = report.location.lng

        // Calculate distance between points (using Haversine formula)
        const distance = calculateDistance(userLat, userLng, reportLat, reportLng)

        // If within 500 meters (adjustable threshold)
        if (distance <= 0.5) {
          setLocationStatus("success")
          toast({
            title: "Location verified",
            description: "You are within range of the reported issue.",
          })
          // Automatically proceed to next step after a short delay
          setTimeout(() => setStep("photo"), 1500)
        } else {
          setLocationStatus("error")
          setLocationError(
            `You are ${distance.toFixed(1)} km away from the reported location. You need to be within 0.5 km to verify.`,
          )
        }
      },
      (error) => {
        setLocationStatus("denied")
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access was denied")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out")
            break
          default:
            setLocationError("An unknown error occurred")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const initCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera error",
        description: "Could not access your camera. Please ensure you've granted camera permissions.",
        variant: "destructive",
      })
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setPhotoBlob(blob)
              setPhotoPreview(URL.createObjectURL(blob))

              // Stop camera stream
              if (video.srcObject) {
                const stream = video.srcObject as MediaStream
                stream.getTracks().forEach((track) => track.stop())
              }

              // Move to description step
              setStep("description")
            }
          },
          "image/jpeg",
          0.8,
        )
      }
    }
  }

  const retakePhoto = () => {
    setPhotoBlob(null)
    setPhotoPreview(null)
    setStep("photo")
  }

  const handleSubmit = async () => {
    if (!photoBlob) {
      toast({
        title: "Photo required",
        description: "Please take a photo to verify this issue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setStep("submitting")

    try {
      await onVerify(report.id, description, photoBlob)
      toast({
        title: "Verification successful",
        description: "Thank you for verifying this environmental issue!",
      })
      onClose()
    } catch (error) {
      console.error("Error submitting verification:", error)
      toast({
        title: "Verification failed",
        description: "There was an error submitting your verification. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      setStep("description")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Verify in Person</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {step === "location" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <MapPin
                    className={`h-12 w-12 mx-auto mb-2 ${
                      locationStatus === "checking"
                        ? "text-gray-400 animate-pulse"
                        : locationStatus === "success"
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  />

                  {locationStatus === "checking" && <p>Checking your location...</p>}

                  {locationStatus === "success" && <p className="text-green-600 font-medium">Location verified!</p>}

                  {(locationStatus === "error" || locationStatus === "denied") && (
                    <div>
                      <p className="text-red-600 font-medium">Location verification failed</p>
                      {locationError && <p className="text-sm mt-1">{locationError}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    You must be physically present at the location of the reported issue to verify it. This helps ensure
                    the accuracy of our environmental reports.
                  </p>
                </div>
              </div>

              {(locationStatus === "error" || locationStatus === "denied") && (
                <Button onClick={checkLocation} className="w-full">
                  Try Again
                </Button>
              )}
            </div>
          )}

          {step === "photo" && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Please take a clear photo of the environmental issue to verify its current state. This helps confirm
                    the report's accuracy.
                  </p>
                </div>
              </div>

              <Button onClick={capturePhoto} className="w-full flex items-center justify-center">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
          )}

          {step === "description" && (
            <div className="space-y-4">
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Verification photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button variant="outline" size="sm" className="absolute bottom-2 right-2" onClick={retakePhoto}>
                    Retake
                  </Button>
                </div>
              )}

              <div>
                <label htmlFor="verification-description" className="block text-sm font-medium mb-1">
                  Add your observations (optional)
                </label>
                <textarea
                  id="verification-description"
                  className="w-full min-h-[100px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe what you're seeing. Has the situation improved or worsened?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === "submitting" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
              <p>Submitting your verification...</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step !== "location" && step !== "submitting" && (
            <Button variant="outline" onClick={() => setStep(step === "description" ? "photo" : "location")}>
              Back
            </Button>
          )}

          {step === "location" && (
            <Button variant="outline" className="ml-auto" onClick={onClose}>
              Cancel
            </Button>
          )}

          {step === "description" && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              Submit Verification
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
