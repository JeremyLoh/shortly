import express, { Request, Response } from "express"
import pool, { setupDatabase } from "./database.js"
import { isValidHttpUrl } from "./validation/url.js"
import { createNewUrl } from "./model/url.js"

const PORT = 3000 // port need to match docker compose setup for app

async function setupServer() {
  await setupDatabase(pool)
  setupRoutes()
}

function setupRoutes() {
  const app = express()
  app.use(express.json()) // middleware to parse json request body
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
  app.post("/api/shorten", async (req: Request, res: Response) => {
    const { url }: { url: string } = req.body
    if (!isValidHttpUrl(url)) {
      res.status(400).send({ error: "Please provide a valid http / https url" })
      return
    }
    try {
      const entry = await createNewUrl(url)
      res.status(201).send(entry)
    } catch (error: any) {
      res.status(500).send({ error: error.message || "Could not create url" })
    }
  })

  app.get("/api/shorten/:id", (req: Request, res: Response) => {
    const { id } = req.params
    // TODO get original url details
    res.status(200).send("Hello" + id)
  })
}

setupServer()
