import app from '@adonisjs/core/services/app'

app.ready(async () => {
  await app.container.make('socket')
})
