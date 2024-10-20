import { SubmitHandler, useForm } from "react-hook-form"
import "./LoginForm.css"
import { useNavigate } from "react-router-dom"

type FormFields = {
  username: string
  password: string
}

function LoginForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(JSON.stringify(data))
    navigate("/")
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
        <input id="password" type="password" {...register("password")} />
      </div>
      <button type="submit" disabled={isSubmitting}>
        Sign in
      </button>
    </form>
  )
}

export default LoginForm
