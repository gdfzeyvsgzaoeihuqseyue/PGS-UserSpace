export interface FaqTopic {
  id: string
  name: string
  slug: string
}

export interface FaqPlatform {
  id: string
  name: string
  slug: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  status: 'active' | 'inactive'
  isUseful: number
  isUseless: number
  createdAt: string
  updatedAt: string
  topic?: FaqTopic
  platform?: FaqPlatform
}

export interface FaqResponse {
  success: boolean
  message: string
  nb: number
  nbOnPage: number
  currentPage: number
  totalPages: number
  data: Faq[]
}
