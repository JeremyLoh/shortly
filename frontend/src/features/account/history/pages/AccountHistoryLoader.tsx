import { ActionFunctionArgs, redirect } from "react-router-dom"
import {
  getAccountCreatedUrls,
  UrlHistory,
} from "../../../../endpoints/history"

type AccountHistoryData = {
  urls: Array<UrlHistory>
}

// https://stackoverflow.com/questions/76724884/correct-type-for-form-component-action-in-react-router-dom
export async function accountHistoryLoader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const page = url.searchParams.get("page")
  try {
    const { urls } = await getAccountCreatedUrls(page)
    return { urls }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 429) {
      return redirect("/error/too-many-requests")
    }
    return redirect("/error")
  }
}

export type { AccountHistoryData }
