import emitter from '@adonisjs/core/services/emitter'

import AcknowledgeBallHit from '#events/acknowledge_ball_hit'

emitter.listen(AcknowledgeBallHit, [() => import('#listeners/register_ball_hit_data')])
