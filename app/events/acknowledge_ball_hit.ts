import { BaseEvent } from '@adonisjs/core/events'

export default class AcknowledgeBallHit extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public ball: string,
    public data: {
      audio?: string
      word: string
      hash: string
    } | 'terminate',
  ) {
    super()
  }
}
