import * as bodyParser from 'body-parser'
import express from 'express'
import { APIRoute } from './routes/api'
import { UserRoute } from './routes/user'
import { OrderRoute } from './routes/order'

class App {
  public app: express.Application

  public apiRoute: APIRoute = new APIRoute()
  public userRoute: UserRoute = new UserRoute()
  public orderRoute: OrderRoute = new OrderRoute()

  constructor() {
    this.app = express()
    this.app.use(bodyParser.json())

    this.apiRoute.routes(this.app)
    this.userRoute.routes(this.app)
    this.orderRoute.routes(this.app)
  }
}

export default new App().app
