import pg from "pg"
import { getOpenPhishFeed, saveFeedToCsv } from "./malicious_urls/feeds.js"
import malicious from "./model/malicious.js"

// https://github.com/brianc/node-postgres/issues/3060
const pool = new pg.Pool({
  host: "urlShortener", // name of postgresql container (in docker compose)
  port: 5432,
  user: process.env.POSTGRES_USER || "todoChangeUser",
  password: process.env.POSTGRES_PASSWORD || "todoChangePassword",
  database: "urlShortener",
})

async function setupDatabase(pool: pg.Pool) {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS "malicious_urls" (
      id BIGSERIAL PRIMARY KEY,
      url VARCHAR(2048) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS "urls" (
      id BIGSERIAL PRIMARY KEY,
      url VARCHAR(2048) NOT NULL,
      short_code CHAR(7) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS "stats" (
      id BIGSERIAL PRIMARY KEY,
      url_id BIGSERIAL,
      access_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (url_id) REFERENCES "urls"(id)
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS "users" (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
    await pool.query(`CREATE INDEX urls_short_code_idx ON urls (short_code)`)
    await pool.query(
      `CREATE INDEX users_find_user_by_credential_idx ON users (username, hashed_password)`
    )
  } catch (error) {}
}

async function removeDuplicateMaliciousUrls(urls: string[]): Promise<string[]> {
  const client = await pool.connect()
  try {
    // https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
    // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
    const response = await client.query(
      `SELECT url FROM malicious_urls WHERE url = ANY ($1)`,
      [urls]
    )
    const duplicates = new Set(response.rows.map((row) => row.url))
    return urls.filter((url) => !duplicates.has(url))
  } catch (error) {
    console.error("Could not retrieve duplicate malicious urls")
  } finally {
    client.release()
  }
  return []
}

async function populateMaliciousFeeds() {
  const openPhishUrls = await getOpenPhishFeed()
  if (openPhishUrls.length === 0) {
    return
  }
  // remove duplicate urls found in database to prevent DB COPY failure
  const uniqueUrls = await removeDuplicateMaliciousUrls(openPhishUrls)
  if (uniqueUrls.length === 0) {
    return
  }
  saveFeedToCsv(uniqueUrls, "OpenPhish")
  malicious.storeMaliciousUrlsToDatabase("OpenPhish")
}

export default pool
export { setupDatabase, populateMaliciousFeeds }
