import { useRef } from "react"
import CreateAccountForm from "../components/CreateAccountForm/CreateAccountForm.tsx"
import Footer from "../../../components/Footer/Footer.tsx"
import Header from "../../../components/Header/Header.tsx"
import { createAccount } from "../../../endpoints/user.ts"
import { useNavigate } from "react-router-dom"

function CreateAccountPage() {
  const navigate = useNavigate()
  const abortControllerRef = useRef<AbortController | null>(null)

  async function handleCreateAccount(username: string, password: string) {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    await createAccount(username, password, abortControllerRef.current)
    navigate("/login")
  }
  return (
    <>
      <Header />
      <h2>Create a new account</h2>
      <CreateAccountForm handleCreateAccount={handleCreateAccount} />
      <Footer />
    </>
  )
}

export default CreateAccountPage
