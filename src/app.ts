import express from 'express'
import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import * as expressWinston from 'express-winston'
import * as winston from 'winston'
import { APIRoute } from './routes/api'
import { UserRoute } from './routes/user'
import { OrderRoute } from './routes/order'
import * as errorHandler from './utils/errorHandler'

class App {
  public app: express.Application

  public apiRoute: APIRoute = new APIRoute()
  public userRoute: UserRoute = new UserRoute()
  public orderRoute: OrderRoute = new OrderRoute()
  public mongoUrl = 'mongodb://localhost/order-api'

  constructor() {
    this.app = express()
    this.app.use(bodyParser.json())

    this.apiRoute.routes(this.app)
    this.userRoute.routes(this.app)
    this.orderRoute.routes(this.app)

    // init connection with MongoDB
    this.mongoSetup()

    // logger
    this.app.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
      })
    )

    // init error handlers
    this.app.use(errorHandler.logging)
    this.app.use(errorHandler.clientErrorHandler)
    this.app.use(errorHandler.errorHandler)
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

export default new App().app
