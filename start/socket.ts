import app from '@adonisjs/core/services/app'
import wavDecoder from 'wav-decoder'
import wavEncoder from 'wav-encoder'

import { Buffer } from 'node:buffer'

app.ready(async () => {
  const socketService = await app.container.make('socket')

  const ballAudio: Record<string, Array<string>> = {}

  socketService.io.on('connection', (socket) => {
    socket.on('ball-hit-floor', (data) => {
      if (!ballAudio[data.ball]) {
        ballAudio[data.ball] = []
      }

      ballAudio[data.ball].push(data.audio)
    })

    socket.on('ball-hit-floor-end', (data) => {
      const base64Audios = ballAudio[data.ball]

      const decodedAudios = base64Audios.map((base64) => {
        return wavDecoder.decode.sync(Buffer.from(base64, 'base64'))
      })

      // merge all audio
      const mergedAudio = decodedAudios.reduce((acc, audio) => {
        const channelData = audio.channelData[0]
        if (acc.length === 0) {
          return channelData
        }

        const merged = new Float32Array(acc.length + channelData.length)
        merged.set(acc, 0)
        merged.set(channelData, acc.length)
        return merged
      }, new Float32Array(0))

      // encode merged audio
      const mergedBuffer = wavEncoder.encode.sync({
        sampleRate: decodedAudios[0].sampleRate,
        channelData: [mergedAudio],
      })

      // emit the merged audio
      socket.emit('ball-audio', {
        ball: data.ball,
        audio: Buffer.from(mergedBuffer).toString('base64'),
      })
    })
  })
})
