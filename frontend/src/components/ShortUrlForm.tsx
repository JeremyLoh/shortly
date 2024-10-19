import { SubmitHandler, useForm } from "react-hook-form"
import "./ShortUrlForm.css"
import { createNewUrl, Url } from "../endpoints/createUrl"

type FormFields = {
  url: string
}

function ShortUrlForm({
  handleCreateUrl,
}: {
  handleCreateUrl: (url: Url) => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const json = await createNewUrl(data.url)
      handleCreateUrl(json)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("root", {
        message: `Could not create short url. ${error.message}`,
      })
    }
  }
  function isValidUrl(value: string) {
    const errorMessage =
      "Please provide a valid url starting with http: or https:"
    let url
    try {
      url = new URL(value)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return errorMessage
    }
    return url.protocol === "http:" || url.protocol === "https:" || errorMessage
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="short-url-form">
      <label htmlFor="url">Url</label>
      <input
        id="url"
        data-testid="create-new-url-input"
        placeholder="Your long URL..."
        aria-invalid={errors.url ? "true" : "false"}
        className={errors.url ? `error-border` : ""}
        {...register("url", {
          required: "Url is required",
          minLength: { value: 3, message: "Min length is 3" },
          maxLength: { value: 2048, message: "Max length is 2048" },
          validate: {
            validateUrl: isValidUrl,
          },
        })}
      />
      {errors.url && (
        <p role="alert" className="error-text">
          {errors.url.message}
        </p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        data-testid="create-new-url-submit-btn"
      >
        {isSubmitting ? "Loading" : "Submit"}
      </button>
      {errors.root && (
        <p role="alert" className="error-text">
          {errors.root.message}
        </p>
      )}
    </form>
  )
}

export default ShortUrlForm
