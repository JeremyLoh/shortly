// https://vite.dev/guide/env-and-mode#env-files
const baseUrl = import.meta.env.VITE_PROD_BACKEND_URL || ""

export { baseUrl }
