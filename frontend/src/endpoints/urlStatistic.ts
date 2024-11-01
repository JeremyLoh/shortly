import ky from "ky"
import { baseUrl } from "./constant"

interface UrlStat {
  id: string
  accessCount: number
  shortCode: string
  url: string
  createdAt: string
  updatedAt: string | null
}

async function getUrlStat(shortCode: string): Promise<UrlStat> {
  if (shortCode == "") {
    throw new Error("Short Code cannot be blank")
  }
  try {
    const response = await ky.get(baseUrl + `/api/shorten/${shortCode}/stats`, {
      retry: { limit: 0 },
    })
    if (!response.ok) {
      throw new Error("Could not get url information")
    }
    const json: UrlStat = await response.json()
    return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 429) {
      const retryAfterInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Too Many Requests, try again after ${retryAfterInSeconds} seconds`
      )
    }
    if (error.name === "HTTPError") {
      throw new Error(error.response.statusText)
    }
    throw error
  }
}

export type { UrlStat }
export { getUrlStat }
