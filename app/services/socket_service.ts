import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import server from '@adonisjs/core/services/server'
import { parse, serialize } from 'cookie-es'
import { Server } from 'socket.io'
import { ulid } from 'ulidx'

import type SocketSessionService from '#services/socket_session_service'
import type { Socket } from 'socket.io'

export default class SocketService {
  io: Server
  session: SocketSessionService

  constructor(
    socketSessionService: SocketSessionService,
  ) {
    this.session = socketSessionService

    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: 'https://smallest-ai-task-bouncing-ball-audio-nuxt.vercel.app',
        credentials: true,
      },
    })

    this.io.engine.on('initial_headers', (headers, req) => {
      const reqCookies = parse(req.headers.cookie || '')
      const sessionCookie = serialize('session', reqCookies.session || ulid(), { sameSite: 'lax', httpOnly: true, secure: app.inProduction, path: '/' })
      headers['Set-Cookie'] = sessionCookie
    })

    this.io.use(this.authenticate)

    this.onConnection()

    logger.info('socket service instantiated')
  }

  private onConnection() {
    this.io.on('connection', (socket) => {
      this.session.add(socket.session.id, socket.id)

      logger.info('socket connected with id: %s of session: %s', socket.id, socket.session.id)

      socket.on('disconnect', () => {
        this.session.remove(socket.session.id, socket.id)

        logger.info('socket connection closed with id: %s of session: %s', socket.id, socket.session.id)
      })
    })
  }

  private authenticate(socket: Socket, next: (err?: Error | undefined) => void) {
    const cookies = parse(socket.handshake.headers.cookie || '')
    if (!cookies.session) {
      return next(new Error('No session cookie found'))
    }

    socket.session = { id: cookies.session }
    return next()
  }
}
