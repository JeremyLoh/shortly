import { SubmitHandler, useForm } from "react-hook-form"
import "./ShortUrlForm.css"

type FormFields = {
  url: string
}

function ShortUrlForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // TODO call backend to get short url using relative path "/api"
    console.log(data)
    // const response = await fetch("/api/shorten/nb7GB7H")
    // const json = await response.json()
    // console.log(JSON.stringify(json))
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
      <button type="submit">Submit</button>
    </form>
  )
}

export default ShortUrlForm
