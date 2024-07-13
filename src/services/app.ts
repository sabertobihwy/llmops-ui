import { post } from '@/utils/request'
import type { OpenaiRsp } from '@/model/app'

export const openai_app = (api_key: string, query: string) => {
  return post<OpenaiRsp>(`/openai/${api_key}`, {
    body: { query: query },
  })
}
