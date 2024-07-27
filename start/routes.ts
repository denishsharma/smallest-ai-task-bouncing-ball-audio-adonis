/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import logger from '@adonisjs/core/services/logger'
import router from '@adonisjs/core/services/router'

router.get('/', async ({ session }) => {
  logger.info(session.all())

  return {
    hello: 'world',
  }
})
