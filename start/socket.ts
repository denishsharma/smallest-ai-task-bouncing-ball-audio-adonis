import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'

import { SocketEvents } from '#constants/socket'
import AcknowledgeBallHit from '#events/acknowledge_ball_hit'
import BallAudioProcessed from '#events/ball_audio_processed'

app.ready(async () => {
  const socketService = await app.container.make('socket')

  const ballAudio: Record<string, Array<string>> = {}

  socketService.io.on('connection', (socket) => {
    socket.on(SocketEvents.BALL_HIT_FLOOR, (data: { ball: string, word: { text: string, hash: string }, audio: string }) => {
      if (!ballAudio[data.ball]) {
        ballAudio[data.ball] = []
      }

      AcknowledgeBallHit.dispatch(
        data.ball,
        {
          audio: data.audio,
          word: data.word.text,
          hash: data.word.hash,
        },
      )

      ballAudio[data.ball].push(data.audio)
    })

    socket.on(SocketEvents.BALL_HIT_FLOOR_END, (data: { ball: string }) => {
      AcknowledgeBallHit.dispatch(data.ball, 'terminate')
    })

    emitter.on(BallAudioProcessed, (data) => {
      socket.emit(SocketEvents.BALL_AUDIO, {
        ball: data.ball,
        audio: data.audio,
      })
    })
  })
})
