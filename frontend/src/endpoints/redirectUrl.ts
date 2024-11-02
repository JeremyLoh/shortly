import ky from "ky"
import { baseUrl } from "./constant"

type UrlResponse = {
  id: string
  url: string
  shortCode: string
  createdAt: string
  updatedAt: string | null
}

async function getRedirectUrl(shortCode: string): Promise<string> {
  const response = await ky.get(baseUrl + "/api/shorten/" + shortCode, {
    retry: { limit: 0 },
  })
  if (!response.ok) {
    throw new Error("Could not get url information")
  }
  const data: UrlResponse = await response.json()
  return data.url
}

export { getRedirectUrl }
