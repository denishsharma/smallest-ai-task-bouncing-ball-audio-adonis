import type SocketService from '#services/socket_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    socket: SocketService
  }
}
