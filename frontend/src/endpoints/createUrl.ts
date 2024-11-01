import ky from "ky"
import { baseUrl } from "./constant"

interface Url {
  id: string
  url: string
  shortCode: string
  createdAt: string // e.g. "2024-10-11T13:51:54.474Z"
  updatedAt: string | null
}

async function createNewUrl(url: string): Promise<Url> {
  try {
    const response = await ky.post(baseUrl + "/api/shorten", {
      json: { url },
      retry: { limit: 0 },
    })
    if (!response.ok || response.status !== 201) {
      throw new Error("Could not create short url")
    }
    return await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 429) {
      const timeoutInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
      )
    }
    throw error
  }
}

export type { Url }
export { createNewUrl }
