import { useLoaderData } from "react-router-dom"

function RedirectUrlPage() {
  const { url } = useLoaderData() as { url: string }
  window.location.replace(url)
  return null
}

export default RedirectUrlPage
