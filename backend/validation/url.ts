import { URL } from "url"

function isValidHttpUrl(url: string): boolean {
  if (url.length > 2048) {
    return false
  }
  const protocols = ["http:", "https:"]
  try {
    new URL(url)
    const foundProtocols = protocols.filter((protocol) =>
      url.toLowerCase().startsWith(protocol)
    )
    return foundProtocols.length > 0 && url.includes(".") && !url.includes("..")
  } catch (error) {
    return false
  }
}

export { isValidHttpUrl }
