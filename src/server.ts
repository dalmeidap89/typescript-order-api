import fs from 'fs'
import https from 'https'
import app from './app'

const { PORT } = process.env
const httpsOptions = {
  key: fs.readFileSync('./certificates/key.pem'),
  cert: fs.readFileSync('./certificates/cert.pem'),
}

https.createServer(httpsOptions, app).listen(PORT)
