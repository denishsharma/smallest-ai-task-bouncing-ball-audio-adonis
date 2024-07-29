import type { ApplicationService } from '@adonisjs/core/types'

import AudioProcessorManagerService from '#services/audio_processor_manager_service'

export default class AudioProcessManagerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(AudioProcessorManagerService, () => {
      return new AudioProcessorManagerService()
    })

    this.app.container.alias('audio_process_manager', AudioProcessorManagerService)
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
    await this.app.container.make('audio_process_manager')
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
