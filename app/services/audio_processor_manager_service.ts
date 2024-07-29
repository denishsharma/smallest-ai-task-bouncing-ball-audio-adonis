import logger from '@adonisjs/core/services/logger'

import audioService from '#services/audio_service'

class AudioProcessor {
  #isProcessing = false
  #isCompleted = false

  #data: Array<{ sampleRate: number, channelData: Array<Float32Array> }> = []
  #mergedAudio: { sampleRate: number, channelData: Array<Float32Array> } | null = null

  constructor(
    public id: string,
    public onCompleted?: (processor: AudioProcessor) => void,
  ) {
    logger.info('audio processor %s created', id)
  }

  add(data: { sampleRate: number, channelData: Array<Float32Array> } | 'terminate') {
    if (data === 'terminate') {
      this.process()
      return
    }

    this.#data.push(data)
  }

  process() {
    this.#isProcessing = true

    logger.info('processing %d audio data for processor %s', this.#data.length, this.id)

    if (this.#data.length > 0) {
      const mergedAudio = audioService.mergeAudio(...this.#data)
      this.#mergedAudio = mergedAudio
    }

    this.#isCompleted = true
    this.#isProcessing = false

    logger.info('audio data processed for processor %s', this.id)

    this.onCompleted?.(this)
  }

  audio() {
    if (!this.#mergedAudio) {
      throw new Error('Audio not processed yet')
    }

    return audioService.encodeAudio(this.#mergedAudio)
  }

  status(): 'idle' | 'processing' | 'completed' {
    return this.#isProcessing ? 'processing' : this.#isCompleted ? 'completed' : 'idle'
  }
}

export default class AudioProcessorManagerService {
  #processors: Map<string, AudioProcessor> = new Map()

  constructor() {
    logger.info('audio processor manager service initialized')
  }

  create(id: string, onCompleted?: (processor: AudioProcessor) => void) {
    this.#processors.set(id, new AudioProcessor(id, (processor) => {
      this.#processors.delete(processor.id)
      onCompleted?.(processor)
    }))
  }

  has(id: string) {
    return this.#processors.has(id)
  }

  entry(id: string, data: string | 'terminate') {
    this.get(id).add(data === 'terminate' ? 'terminate' : audioService.decodeAudio(data))
  }

  status(id: string) {
    this.get(id).status()
  }

  get(id: string) {
    const processor = this.#processors.get(id)
    if (!processor) {
      throw new Error(`Cannot find processor ${id}`)
    }

    return processor
  }
}
