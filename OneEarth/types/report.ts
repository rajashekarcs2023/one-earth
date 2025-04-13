export interface Comment {
  id: string
  reportId: string
  text: string
  timestamp: string
  userName: string
}

export interface Report {
  id: string
  image_url: string
  label: string
  severity: number
  upvotes: number
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
}

export interface ReportFormData {
  image: File | null
  severity: number
  notifyAuthority: boolean
  description?: string
}
