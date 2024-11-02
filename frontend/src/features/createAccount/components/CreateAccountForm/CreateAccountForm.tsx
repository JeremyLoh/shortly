import { SubmitHandler, useForm } from "react-hook-form"
import "./CreateAccountForm.css"

type CreateAccountProps = {
  handleCreateAccount: (username: string, password: string) => Promise<void>
}

type FormFields = {
  username: string
  password: string
  confirmPassword: string
}

function CreateAccountForm({ handleCreateAccount }: CreateAccountProps) {
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await handleCreateAccount(data.username, data.password)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("root", {
        message: error.message,
      })
    }
  }
  return (
    <form id="create-account-form" onSubmit={handleSubmit(onSubmit)}>
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
      {errors.username && (
        <div>
          <p role="alert" className="error-text">
            {errors.username.message}
          </p>
        </div>
      )}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password needs to have min length of 8 characters",
          },
        })}
      />
      {errors.password && (
        <div>
          <p role="alert" className="error-text">
            {errors.password.message}
          </p>
        </div>
      )}
      <label htmlFor="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: {
            matchesPassword: (v) =>
              v === getValues("password") ||
              "Password and Confirm Password needs to match",
          },
        })}
      />
      {errors.confirmPassword && (
        <div>
          <p role="alert" className="error-text">
            {errors.confirmPassword.message}
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
        Create Account
      </button>
    </form>
  )
}

export default CreateAccountForm
