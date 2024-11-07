import "./AccountActions.css"
import { Link } from "react-router-dom"
import { useAuth } from "../../../../auth/hooks/useAuth"

function AccountActions() {
  const auth = useAuth()
  return (
    <>
      {auth && auth.user ? (
        <div className="account-action-container">
          <p className="welcome-message">
            👋 Welcome back {auth.user.username}
          </p>
          <div className="account-action-links">
            <Link to="/history">History</Link>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default AccountActions
