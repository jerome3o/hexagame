import { MousePosition } from "./commonModels";

type MouseDragFunctions = ((
  oldPosition: MousePosition,
  newPosition: MousePosition
) => void)[];

function setUpMouse(
  leftClickDrag: MouseDragFunctions = [],
  rightClickDrag: MouseDragFunctions = [],
  scroll: ((scrollDelta: number) => void)[] = [],
  hover: ((position: MousePosition) => void)[] = []
) {
  // listen for mouse drag
  let isDraggingLeft = false;
  let isDraggingRight = false;

  let previousMousePosition = {
    x: 0,
    y: 0,
  };

  function callAllSingle(
    fns: ((position: MousePosition) => void)[],
    event: MouseEvent
  ) {
    fns.forEach((f) => f({ x: event.offsetX, y: event.offsetY }));
  }

  function callAllDelta(
    fns: ((oldPosition: MousePosition, newPosition: MousePosition) => void)[],
    event: MouseEvent
  ) {
    fns.forEach((f) =>
      f(previousMousePosition, {
        x: event.offsetX,
        y: event.offsetY,
      })
    );
  }

  document.addEventListener("mousedown", (event) => {
    // check if left click
    if (event.button === 0) {
      isDraggingLeft = true;
    } else if (event.button === 2) {
      isDraggingRight = true;
    }
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });

  document.addEventListener("mouseup", (event) => {
    // check if left click
    if (event.button === 0) {
      isDraggingLeft = false;
    } else if (event.button === 2) {
      isDraggingRight = false;
    }

    if (!isDraggingLeft && !isDraggingRight) {
      callAllSingle(hover, event);
    }
  });

  document.addEventListener("mousemove", (event) => {
    // only update if dragging
    if (!isDraggingLeft && !isDraggingRight) {
      callAllSingle(hover, event);
      return;
    }

    if (isDraggingLeft) {
      callAllDelta(leftClickDrag, event);
    }

    if (isDraggingRight) {
      callAllDelta(rightClickDrag, event);
    }

    // update previous mouse position
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });

  // listen for mouse scroll
  document.addEventListener("wheel", (event) => {
    // call functions
    scroll.forEach((f) => f(event.deltaY));
  });
}

export { setUpMouse, type MousePosition };
