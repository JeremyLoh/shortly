import ky from "ky"
import { writeFileSync } from "node:fs"
import { EOL } from "node:os"

async function getOpenPhishFeed(): Promise<string[]> {
  // updates every 12 hours - https://openphish.com/phishing_feeds.html
  const url =
    "https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt"
  try {
    const response = await ky.get(url, { retry: { limit: 0 } })
    const text = await response.text()
    return text.split("\n")
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getBlackbookFeed(): Promise<string[]> {
  const url =
    "https://raw.githubusercontent.com/stamparm/blackbook/master/blackbook.txt"
  try {
    const response = await ky.get(url, { retry: { limit: 0 } })
    const text = await response.text()
    return text.split("\n")
  } catch (error) {
    console.error(error)
    return []
  }
}

function saveFeedToCsv(feed: string[], fileName: string) {
  const content = feed.join(EOL)
  try {
    writeFileSync(`./malicious_urls/${fileName}.csv`, content, { flag: "w" })
    console.log(`Successful write of malicious feed to file ${fileName}.csv`)
  } catch (error) {
    console.error(error)
  }
}

export { getOpenPhishFeed, getBlackbookFeed, saveFeedToCsv }
