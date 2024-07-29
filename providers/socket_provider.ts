import type { ApplicationService } from '@adonisjs/core/types'

import SocketService from '#services/socket_service'
import SocketSessionService from '#services/socket_session_service'

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(SocketSessionService, () => {
      return new SocketSessionService()
    })

    this.app.container.singleton(SocketService, async () => {
      const socketSessionService = await this.app.container.make('socket_session')
      return new SocketService(socketSessionService)
    })

    this.app.container.alias('socket_session', SocketSessionService)
    this.app.container.alias('socket', SocketService)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    await this.app.container.make('socket')
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}

declare module 'socket.io' {
  interface Socket {
    session: {
      id: string
    }
  }
}
