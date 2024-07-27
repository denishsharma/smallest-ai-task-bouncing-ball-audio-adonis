import logger from '@adonisjs/core/services/logger'
import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

export default class SocketService {
  io: Server

  constructor() {
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: true,
        credentials: true,
      },
    })

    this.onConnection()

    logger.info('socket service instantiated')
  }

  private onConnection() {
    this.io.on('connection', (socket) => {
      logger.info('socket connected', socket.id)

      socket.on('disconnect', () => {
        logger.info('socket disconnected', socket.id)
      })
    })
  }
}
