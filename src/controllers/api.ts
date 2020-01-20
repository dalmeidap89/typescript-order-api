import { Response, Request } from 'express'
import { formatOutput } from '../utils/response.format'

export const getAPi = (req: Request, res: Response) => {
  // formatear la respuesta deoendiendo del Header
  // application/json , application/xml
  return formatOutput(res, { title: 'Order API' }, 200)
}
