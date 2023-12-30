interface KeyHandler {
  key: string;
  handler: () => void;
}

function setUpKeys(
  keyPressedHandlers: KeyHandler[] = [],
  onKeyDownHandlers: KeyHandler[] = [],
  onKeyUpHandlers: KeyHandler[] = []
): () => void {
  const pressedKeys = new Set<string>();

  // map of key to list of handler
  const keyDownMap = new Map<string, (() => void)[]>();
  const keyUpMap = new Map<string, (() => void)[]>();
  const keyPressedMap = new Map<string, (() => void)[]>();

  function addToMap(map: Map<string, (() => void)[]>, handler: KeyHandler) {
    map.set(handler.key, [...(map.get(handler.key) || []), handler.handler]);
  }

  keyPressedHandlers.forEach((handler) => addToMap(keyPressedMap, handler));
  onKeyDownHandlers.forEach((handler) => addToMap(keyDownMap, handler));
  onKeyUpHandlers.forEach((handler) => addToMap(keyUpMap, handler));

  function callHandlers(map: Map<string, (() => void)[]>, key: string) {
    const handlers = map.get(key) || [];
    handlers.forEach((handler) => handler());
  }

  document.addEventListener("keydown", (event) => {
    pressedKeys.add(event.key);
    callHandlers(keyDownMap, event.key);
  });

  document.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key);
    callHandlers(keyUpMap, event.key);
  });

  const onGameTick = () => {
    pressedKeys.forEach((key) => callHandlers(keyPressedMap, key));
  };

  return onGameTick;
}

export { setUpKeys };
