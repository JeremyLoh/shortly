import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import RedirectUrlPage from "./pages/RedirectUrlPage.tsx"
import { redirectLoader } from "./pages/RedirectUrlLoader.tsx"
import UrlStatsPage from "./pages/UrlStatsPage.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/:shortCode",
    element: <RedirectUrlPage />,
    loader: redirectLoader,
  },
  {
    path: "/stats",
    element: <UrlStatsPage />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
