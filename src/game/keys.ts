type KeyHandlerCallback = (deltaTime: number | undefined) => void

interface KeyHandler {
  key: string
  handler: KeyHandlerCallback
}

function setUpKeys(
  keyPressedHandlers: KeyHandler[] = [],
  onKeyDownHandlers: KeyHandler[] = [],
  onKeyUpHandlers: KeyHandler[] = []
): (deltaTime: number) => void {
  const pressedKeys = new Set<string>()

  // map of key to list of handler
  const keyDownMap = new Map<string, KeyHandlerCallback[]>()
  const keyUpMap = new Map<string, KeyHandlerCallback[]>()
  const keyPressedMap = new Map<string, KeyHandlerCallback[]>()

  function addToMap(map: Map<string, KeyHandlerCallback[]>, handler: KeyHandler) {
    map.set(handler.key, [...(map.get(handler.key) || []), handler.handler])
  }

  keyPressedHandlers.forEach((handler) => addToMap(keyPressedMap, handler))
  onKeyDownHandlers.forEach((handler) => addToMap(keyDownMap, handler))
  onKeyUpHandlers.forEach((handler) => addToMap(keyUpMap, handler))

  function callHandlers(map: Map<string, KeyHandlerCallback[]>, key: string, deltaTime: number | undefined) {
    const handlers = map.get(key) || []
    handlers.forEach((handler) => handler(deltaTime))
  }

  document.addEventListener("keydown", (event) => {
    pressedKeys.add(event.key)
    callHandlers(keyDownMap, event.key, undefined)
  })

  document.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key)
    callHandlers(keyUpMap, event.key, undefined)
  })

  const onGameTick = (deltaTime: number | undefined) => {
    pressedKeys.forEach((key) => callHandlers(keyPressedMap, key, deltaTime))
  }

  return onGameTick
}

export { setUpKeys }
