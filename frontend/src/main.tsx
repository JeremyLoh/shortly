import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import RedirectUrlPage from "./pages/RedirectUrlPage.tsx"
import { redirectLoader } from "./pages/RedirectUrlLoader.tsx"
import UrlStatsPage from "./features/stats/pages/UrlStatsPage.tsx"
import LoginPage from "./features/login/pages/LoginPage.tsx"
import LogoutPage from "./pages/LogoutPage.tsx"
import AuthProvider from "./features/auth/AuthProvider.tsx"
import CreateAccountPage from "./features/createAccount/pages/CreateAccountPage.tsx"
import AccountHistoryPage from "./features/account/history/pages/AccountHistoryPage.tsx"
import { accountHistoryLoader } from "./features/account/history/pages/AccountHistoryLoader.tsx"
import ProtectedRoute from "./pages/ProtectedRoute.tsx"

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    errorElement: <NotFoundPage errorMessage="404 Not Found" />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/history",
            element: <AccountHistoryPage />,
            loader: accountHistoryLoader,
            errorElement: <NotFoundPage errorMessage="404 Not Found" />,
          },
        ],
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
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
      {
        path: "/logout",
        element: <LogoutPage />,
        errorElement: <NotFoundPage errorMessage="404 Not Found" />,
      },
      {
        path: "/register",
        element: <CreateAccountPage />,
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
