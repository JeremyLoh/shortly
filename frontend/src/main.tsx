import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import RedirectUrlPage from "./pages/RedirectUrlPage.tsx"
import { redirectLoader } from "./pages/RedirectUrlLoader.tsx"
import UrlStatsPage from "./pages/UrlStatsPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import { AuthProvider } from "./hooks/useAuth.tsx"

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <NotFoundPage errorMessage="404 Not Found" />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
      {
        path: "/error/too-many-requests",
        element: <NotFoundPage errorMessage="429 Too Many Requests" />,
      },
      {
        path: "/error",
        element: <NotFoundPage errorMessage="404 Not Found" />,
      },
      {
        path: "/:shortCode",
        element: <RedirectUrlPage />,
        loader: redirectLoader,
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
      {
        path: "/stats",
        element: <UrlStatsPage />,
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
