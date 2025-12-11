export interface FaqPlatform {
  id: string
  name: string
  slug: string
}

export interface FaqTopic {
  id: string
  name: string
  slug: string
  description?: string
  order?: number
  status?: string
  createdAt?: number
  updatedAt?: number
  platform?: FaqPlatform
  faqCount?: number
  faqs?: Faq[]
}

export interface Faq {
  id: string
  question: string
  answer: string
  status: 'active' | 'inactive'
  isUseful: number
  isUseless: number
  createdAt: number
  updatedAt: number
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

export interface FaqTopicResponse {
  success: boolean
  message: string
  nb: number
  nbOnPage: number
  currentPage: number
  totalPages: number
  data: FaqTopic[]
}
