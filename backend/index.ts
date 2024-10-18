import setupApp from "./server.js"

// port need to match docker compose setup for app
const PORT = 3000

setupApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    app.emit("serverStarted")
  })
})
