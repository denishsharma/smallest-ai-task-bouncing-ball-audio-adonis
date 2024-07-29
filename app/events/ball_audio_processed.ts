import { BaseEvent } from '@adonisjs/core/events'

export default class BallAudioProcessed extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public ball: string,
    public audio: string,
  ) {
    super()
  }
}
