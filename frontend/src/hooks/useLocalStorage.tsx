import { useState } from "react"

// Keeps user state even after page refresh
// https://blog.logrocket.com/authentication-react-router-v6/
function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  // pass initializer function to useState
  const [value, setStoredValue] = useState<T>(() => {
    try {
      const localValue = window.localStorage.getItem(key)
      if (localValue) {
        return JSON.parse(localValue)
      } else {
        window.localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return defaultValue
    }
  })
  function setValue(newValue: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
      setStoredValue(newValue)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message)
      throw error
    }
  }
  return [value, setValue]
}

export default useLocalStorage
