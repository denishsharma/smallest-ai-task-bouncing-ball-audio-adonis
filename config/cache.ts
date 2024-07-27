import { defineConfig, drivers, store } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: 'memory',
  stores: {
    memory: store().useL1Layer(drivers.memory({
      maxSize: 10000,
      maxItems: 5000,
    })),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
