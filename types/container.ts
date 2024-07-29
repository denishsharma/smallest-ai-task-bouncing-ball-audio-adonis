import type AudioProcessorManagerService from '#services/audio_processor_manager_service'
import type SocketService from '#services/socket_service'
import type SocketSessionService from '#services/socket_session_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    socket: SocketService
    socket_session: SocketSessionService
    audio_process_manager: AudioProcessorManagerService
  }
}
