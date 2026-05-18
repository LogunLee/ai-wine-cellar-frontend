import { api } from './client'

export interface WineRecognitionResult {
  producer: string
  name: string
  vintageYear?: number
  region?: string
  country?: string
  wineType?: string
  confidence: number
}

export interface AiModel {
  id: string
  name: string
  provider: string
  purpose: string
  apiKey: string
  baseUrl?: string
  promptConfig?: Record<string, unknown>
  isDefault: boolean
  isActive: boolean
}

export const wineSearchApi = {
  recognize: (imageBase64: string) =>
    api.post<{ wines: WineRecognitionResult[] }>('/wine-search/recognize', { imageBase64 }),
}

export const aiModelsApi = {
  list: () => api.get<AiModel[]>('/ai-models'),
  get: (id: string) => api.get<AiModel>(`/ai-models/${id}`),
  create: (data: Omit<AiModel, 'id'>) => api.post<AiModel>('/ai-models', data),
  update: (id: string, data: Partial<AiModel>) => api.put<AiModel>(`/ai-models/${id}`, data),
  remove: (id: string) => api.delete(`/ai-models/${id}`),
  setDefault: (id: string) => api.post(`/ai-models/${id}/set-default`),
}
