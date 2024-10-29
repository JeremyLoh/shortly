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
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await handleCreateAccount(data.username, data.password)
    } catch (error) {
      // TODO display error in form
      console.error(error)
    }
  }
  return (
    <form id="create-account-form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" {...register("username")} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />

      <label htmlFor="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        {...register("confirmPassword")}
      />
      <button type="submit" disabled={isSubmitting}>
        Create Account
      </button>
    </form>
  )
}

export default CreateAccountForm
