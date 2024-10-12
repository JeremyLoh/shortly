import ky from "ky"

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
    const response = await ky.get(`/api/shorten/${shortCode}/stats`)
    console.log({ response })
    if (!response.ok) {
      throw new Error("Could not get url information")
    }
    const json: UrlStat = await response.json()
    return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "HTTPError") {
      throw new Error(error.response.statusText)
    }
    throw error
  }
}

export type { UrlStat }
export { getUrlStat }
