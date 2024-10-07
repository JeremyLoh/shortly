import { URL } from "url"

function isValidHttpUrl(url: string): boolean {
  if (url.length > 2048) {
    return false
  }
  const protocols = ["http:", "https:"]
  try {
    new URL(url)
    return (
      protocols.filter((protocol) => url.toLowerCase().startsWith(protocol))
        .length > 0
    )
  } catch (error) {
    return false
  }
}

export { isValidHttpUrl }
