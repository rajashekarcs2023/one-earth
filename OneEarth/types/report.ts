export interface Comment {
  id: string
  reportId: string
  text: string
  timestamp: string
  userName: string
}

export interface Verification {
  timestamp: string
  description: string
  photoUrl: string
  verifiedBy: string
}

export interface Report {
  id?: string
  _id?: string
  image_url: string
  label: string
  severity: number
  upvotes: number
  followers?: number
  location: {
    lat: number
    lng: number
  }
  locationName?: string
  notifyAuthority: boolean
  timestamp: string
  description?: string
  type?: string
  verifiedBy?: string
  actionStatus?: {
    acted: boolean
    status: string
  }
  comments?: Comment[]
  verifications?: Verification[]
}

export interface ReportFormData {
  image: File | null
  severity: number
  notifyAuthority: boolean
  description?: string
}
