import { NextFunction, Request, Response } from "express"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

export function getRateLimiterMocks() {
  return {
    readShortUrlLimiter: getMockMiddleware(),
    createShortUrlLimiter: getMockMiddleware(),
    updateShortUrlLimiter: getMockMiddleware(),
    deleteShortUrlLimiter: getMockMiddleware(),
    loginAccountLimiter: getMockMiddleware(),
    logoutAccountLimiter: getMockMiddleware(),
    createAccountLimiter: getMockMiddleware(),
    checkLoginStatusLimiter: getMockMiddleware(),
    checkMaliciousUrlLimiter: getMockMiddleware(),
  }
}
