export default class SocketSessionService {
  #mappings: Map<string, Set<string>> = new Map()

  has(sessionId: string): boolean
  has(sessionId: string, socketId: string): boolean
  has(sessionId: string, socketId?: string): boolean {
    if (socketId) {
      return this.#mappings.has(sessionId) && this.#mappings.get(sessionId)!.has(socketId)
    }

    return this.#mappings.has(sessionId)
  }

  remove(sessionId: string): void
  remove(sessionId: string, socketId: string): void
  remove(sessionId: string, socketId?: string): void {
    if (socketId) {
      if (this.#mappings.has(sessionId)) {
        const sockets = this.#mappings.get(sessionId)!
        sockets.delete(socketId)
        if (sockets.size === 0) {
          this.#mappings.delete(sessionId)
        }
      }
    } else {
      this.#mappings.delete(sessionId)
    }
  }

  add(sessionId: string, socketId: string): void {
    if (!this.#mappings.has(sessionId)) {
      this.#mappings.set(sessionId, new Set())
    }

    this.#mappings.get(sessionId)!.add(socketId)
  }

  count(sessionId: string): number {
    return this.#mappings.has(sessionId) ? this.#mappings.get(sessionId)!.size : 0
  }
}
