import wavDecoder from 'wav-decoder'
import wavEncoder from 'wav-encoder'

import { Buffer } from 'node:buffer'

class AudioService {
  decodeAudio(base64: string): { sampleRate: number, channelData: Array<Float32Array> } {
    return wavDecoder.decode.sync(this.fromBase64(base64))
  }

  encodeAudio(audio: { sampleRate: number, channelData: Array<Float32Array> }): ArrayBuffer {
    return wavEncoder.encode.sync(audio)
  }

  mergeAudio(...audios: Array<{ sampleRate: number, channelData: Array<Float32Array> }>): { sampleRate: number, channelData: Array<Float32Array> } {
    const mergedAudio = audios.reduce((acc, audio) => {
      const channelData = audio.channelData[0]
      if (acc.length === 0) {
        return channelData
      }

      const merged = new Float32Array(acc.length + channelData.length)
      merged.set(acc, 0)
      merged.set(channelData, acc.length)
      return merged
    }, new Float32Array(0))

    return {
      sampleRate: audios[0].sampleRate,
      channelData: [mergedAudio],
    }
  }

  toBase64(buffer: ArrayBuffer): string {
    return Buffer.from(buffer).toString('base64')
  }

  fromBase64(base64: string): ArrayBuffer {
    return Buffer.from(base64, 'base64')
  }
}

const audioService = new AudioService()

export default audioService
