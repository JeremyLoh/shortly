import ky from "ky"

interface Url {
  id: string
  url: string
  shortCode: string
  createdAt: string // e.g. "2024-10-11T13:51:54.474Z"
  updatedAt: string | null
}

async function createNewUrl(url: string): Promise<Url> {
  const response = await ky.post("/api/shorten", {
    json: { url },
  })
  if (!response.ok || response.status !== 201) {
    throw new Error("Could not create short url")
  }
  return await response.json()
}

export type { Url }
export { createNewUrl }
