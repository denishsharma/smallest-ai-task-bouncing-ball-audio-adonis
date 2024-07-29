import { inject } from '@adonisjs/core'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

import type AcknowledgeBallHit from '#events/acknowledge_ball_hit'

import BallAudioProcessed from '#events/ball_audio_processed'
import AudioProcessorManagerService from '#services/audio_processor_manager_service'
import audioService from '#services/audio_service'

@inject()
export default class RegisterBallHitData {
  constructor(
    protected audioProcessorManager: AudioProcessorManagerService,
  ) {}

  handle(event: AcknowledgeBallHit) {
    if (!this.audioProcessorManager.has(event.ball)) {
      logger.warn('audio processor not found for ball %s, creating one...', event.ball)
      this.audioProcessorManager.create(event.ball, (processor) => {
        try {
          emitter.emit(BallAudioProcessed, {
            ball: event.ball,
            audio: audioService.toBase64(processor.audio()),
          })
        } catch (error) {
          logger.error('error processing audio for ball %s: %s', event.ball, error.message)
        }
      })
    }

    logger.info('registering audio data for ball %s with word %s', event.ball, typeof event.data === 'object' ? event.data.word : '<<terminate>>')
    this.audioProcessorManager.entry(event.ball, event.data === 'terminate' ? 'terminate' : event.data.audio || 'terminate')
  }
}
