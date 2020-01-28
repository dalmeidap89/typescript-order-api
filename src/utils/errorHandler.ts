import { Response, Request, NextFunction } from 'express'

export const logging = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  next(err)
}

export const clientErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
export const errorHandler = (err: Error, req: Request, res: Response) => {
  res.status(500).send({ error: err.message })
}
