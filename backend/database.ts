import pg from "pg"

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
    await pool.query(`CREATE TABLE IF NOT EXISTS "urls" (
      id BIGSERIAL PRIMARY KEY,
      url VARCHAR(2048),
      short_code CHAR(7) UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS "stats" (
      id BIGSERIAL PRIMARY KEY,
      url_id BIGSERIAL,
      access_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (url_id) REFERENCES "urls"(id)
    )`)
    await pool.query(`CREATE INDEX urls_short_code_idx ON urls (short_code)`)
  } catch (error) {}
}

export default pool
export { setupDatabase }
