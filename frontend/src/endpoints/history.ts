import ky from "ky"
import { baseUrl } from "./constant"

type UrlHistory = {
  id: string
  url: string
  shortCode: string
  updatedAt: string | null
  createdAt: string
}

type AccountHistoryResponse = {
  urls: Array<UrlHistory>
  total: string
}

async function getAccountCreatedUrls(
  page: string | null
): Promise<AccountHistoryResponse> {
  try {
    const response = await ky.post(baseUrl + "/api/account/history", {
      json: { page: page == null ? "1" : page },
      retry: { limit: 0 },
    })
    if (response.status !== 200) {
      throw new Error("Could not get created urls for account")
    }
    return response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 401) {
      throw new Error("Invalid username / password")
    }
    if (error.response.status === 429) {
      const timeoutInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
      )
    }
    throw error
  }
}

export { getAccountCreatedUrls }
export type { UrlHistory }
