import { Params, redirect } from "react-router-dom"
import { getRedirectUrl } from "../endpoints/redirectUrl"

// https://stackoverflow.com/questions/75324193/react-router-6-how-to-strongly-type-the-params-option-in-route-loader
export async function redirectLoader({
  params,
}: {
  params: Params<"shortCode">
}) {
  try {
    const shortCode = params.shortCode
    if (!shortCode) {
      return redirect("/error")
    }
    const url = await getRedirectUrl(shortCode)
    return { url }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 429) {
      return redirect("/error/too-many-requests")
    }
    return redirect("/error")
  }
}
