import "./LoginForm.css"
import { useNavigate } from "react-router-dom"
import { SubmitHandler, useForm } from "react-hook-form"

type LoginProps = {
  handleLogin: (username: string, password: string) => Promise<void>
}

type FormFields = {
  username: string
  password: string
}

function LoginForm({ handleLogin }: LoginProps) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await handleLogin(data.username, data.password)
      navigate("/")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("root", {
        message: error.message,
      })
    }
  }
  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="input-row">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register("username", {
            required: "Username is required",
            maxLength: {
              value: 255,
              message: "Username cannot be longer than 255 characters",
            },
          })}
        />
      </div>
      {errors.username && (
        <div>
          <p role="alert" className="error-text">
            {errors.username.message}
          </p>
        </div>
      )}
      <div className="input-row">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
      </div>
      {errors.password && (
        <div>
          <p role="alert" className="error-text">
            {errors.password.message}
          </p>
        </div>
      )}
      {errors.root && (
        <div>
          <p role="alert" className="error-text">
            {errors.root.message}
          </p>
        </div>
      )}
      <button type="submit" disabled={isSubmitting}>
        Sign in
      </button>
    </form>
  )
}

export default LoginForm
