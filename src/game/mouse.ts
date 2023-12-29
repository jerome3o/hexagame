interface MousePosition {
  x: number;
  y: number;
}

function setUpMouse(
  leftClickDrag: ((
    oldPosition: MousePosition,
    newPosition: MousePosition
  ) => void)[],
  rightClickDrag: ((
    oldPosition: MousePosition,
    newPosition: MousePosition
  ) => void)[] = [],
  scroll: ((scrollDelta: number) => void)[] = []
) {
  // listen for mouse drag
  let isDraggingLeft = false;
  let isDraggingRight = false;

  let previousMousePosition = {
    x: 0,
    y: 0,
  };

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
  });

  document.addEventListener("mousemove", (event) => {
    // only update if dragging
    if (!isDraggingLeft && !isDraggingRight) {
      return;
    }

    if (isDraggingLeft) {
      // call functions
      leftClickDrag.forEach((f) =>
        f(previousMousePosition, {
          x: event.offsetX,
          y: event.offsetY,
        })
      );
    }

    if (isDraggingRight) {
      // call functions
      rightClickDrag.forEach((f) =>
        f(previousMousePosition, {
          x: event.offsetX,
          y: event.offsetY,
        })
      );
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
