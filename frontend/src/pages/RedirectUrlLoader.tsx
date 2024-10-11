import ky from "ky"
import { Params } from "react-router-dom"

type UrlResponse = {
  id: string
  url: string
  shortCode: string
  createdAt: string
  updatedAt: string | null
}

// https://stackoverflow.com/questions/75324193/react-router-6-how-to-strongly-type-the-params-option-in-route-loader
export async function redirectLoader({
  params,
}: {
  params: Params<"shortCode">
}) {
  const response = await ky.get("/api/shorten/" + params.shortCode)
  if (!response.ok) {
    return { url: `${window.location.href}/error` }
  }
  const data: UrlResponse = await response.json()
  return { url: data.url }
}
