import { nanoid } from "nanoid"

function generateId(size: number) {
  return nanoid(size)
}

export { generateId }
