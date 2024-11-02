import { SubmitHandler, useForm } from "react-hook-form"
import "./ShortUrlStatForm.css"
import { getUrlStat, UrlStat } from "../../../../endpoints/urlStatistic.ts"

type FormFields = {
  url: string
}

function ShortUrlStatForm({
  handleUrlStat,
}: {
  handleUrlStat: (urlStat: UrlStat) => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>()
  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      const url = new URL(data.url)
      const shortCode = url.pathname.split("/").pop()
      if (!shortCode || shortCode === "") {
        setError("root", { message: "Short url provided cannot be blank" })
        return
      }
      const stat = await getUrlStat(shortCode)
      handleUrlStat(stat)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("root", {
        message: `Could not get statistic for short url provided (${error.message})`,
      })
    }
  }
  return (
    <div>
      <form id="link-stat-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="url">Short Url</label>
        <input
          id="url"
          type="text"
          placeholder="Your Short URL..."
          {...register("url", {
            required: "Short Url is required",
            minLength: { value: 3, message: "Min length is 3" },
            maxLength: { value: 2048, message: "Max length is 2048" },
          })}
        />
        <button
          disabled={isSubmitting}
          type="submit"
          data-testid="short-url-stat-submit-btn"
        >
          {isSubmitting ? "Loading" : "Search"}
        </button>
      </form>
      {errors.url && (
        <p role="alert" className="error-text">
          {errors.url.message}
        </p>
      )}
      {errors.root && (
        <p role="alert" className="error-text">
          {errors.root.message}
        </p>
      )}
    </div>
  )
}

export default ShortUrlStatForm
