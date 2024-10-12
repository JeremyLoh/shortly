import ky from "ky"
import { Params, redirect } from "react-router-dom"

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
  try {
    const response = await ky.get("/api/shorten/" + params.shortCode, {
      retry: { limit: 0 },
    })
    if (!response.ok) {
      return redirect("/error")
    }
    const data: UrlResponse = await response.json()
    return { url: data.url }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 429) {
      return redirect("/error/too-many-requests")
    }
    return redirect("/error")
  }
}
