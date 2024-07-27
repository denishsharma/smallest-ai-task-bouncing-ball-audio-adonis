import type { ApplicationService } from '@adonisjs/core/types'

import SocketService from '#services/socket_service'

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(SocketService, async () => {
      return new SocketService()
    })

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
