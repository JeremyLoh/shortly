import argon2 from "argon2"

async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password)
    return hash
  } catch (error) {
    return null
  }
}

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isSameHash = await argon2.verify(hashedPassword, password)
    return isSameHash
  } catch (error) {
    return false
  }
}

export { hashPassword, verifyPassword }
