import { createReadStream } from "node:fs"
import { pipeline } from "node:stream/promises"
import { from as copyFrom } from "pg-copy-streams"
import pool from "../database.js"

async function storeMaliciousUrlsToDatabase(fileName: string) {
  // file should only contain unique urls, or else COPY will fail
  const client = await pool.connect()
  try {
    // https://stackoverflow.com/questions/29963242/how-to-increment-primary-key-during-postgres-copy-batch-insert
    // https://www.postgresql.org/docs/current/sql-copy.html
    const ingestStream = client.query(
      copyFrom(`COPY malicious_urls (url) FROM STDIN WITH (FORMAT CSV)`)
    )
    const sourceStream = createReadStream(`./malicious_urls/${fileName}.csv`)
    await pipeline(sourceStream, ingestStream)
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

async function isMaliciousUrl(url: string): Promise<boolean> {
  const client = await pool.connect()
  try {
    const response = await client.query(
      `SELECT url FROM malicious_urls WHERE url = $1`,
      [url]
    )
    return response.rowCount === 1
  } catch (error) {
    throw new Error(
      "Could not check if url is malicious. Please try again later"
    )
  } finally {
    client.release()
  }
}

export default { storeMaliciousUrlsToDatabase, isMaliciousUrl }
