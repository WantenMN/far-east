document.addEventListener("p5Loaded", () => {
  const p5ExtensionLoaded = new CustomEvent("p5ExtensionLoaded");
  window.p5Extension = {};
  p5 = p5 && p5.hasOwnProperty("default") ? p5["default"] : p5;
  const setP5Instance = (instance) => {
    p5Extension.p = instance;
  };
  const setCanvas = (scaledCanvas) => {
    p5Extension.canvas = scaledCanvas;
  };
  const parseColor = (color) =>
    typeof color === "string"
      ? p5Extension.p.color(color)
      : Object.assign({}, color);
  const emptyFunction = () => {};
  const parseStroke = (color) => {
    if (color === null) return () => p5Extension.p.noStroke();
    if (color === undefined) return emptyFunction;
    const colorObject = parseColor(color);
    return () => p5Extension.p.stroke(colorObject);
  };
  const parseFill = (color) => {
    if (color === null) return () => p5Extension.p.noFill();
    if (color === undefined) return emptyFunction;
    const colorObject = parseColor(color);
    return () => p5Extension.p.fill(colorObject);
  };
  const colorWithAlpha = (color, alpha) => {
    const colorObject = parseColor(color);
    colorObject.setAlpha(alpha);
    return colorObject;
  };
  const create = (color, resolution) => {
    const colors = new Array(resolution);
    const maxIndex = resolution - 1;
    if (resolution === 1) {
      colors[0] =
        typeof color === "string"
          ? p5Extension.p.color(color)
          : Object.assign({}, color);
    } else {
      const baseAlpha = p5Extension.p.alpha(color);
      for (let i = 1; i < resolution; i += 1) {
        const alpha = baseAlpha * (i / maxIndex);
        colors[i] = colorWithAlpha(color, alpha);
      }
    }
    return {
      colors,
      maxIndex,
    };
  };
  const inversed255 = 1 / 255;
  const get = (alphaColor, alpha) =>
    alphaColor.colors[Math.round(alphaColor.maxIndex * alpha * inversed255)];
  const alphaColor = Object.freeze({
    __proto__: null,
    create: create,
    get: get,
  });
  const emptyFunction$1 = () => {};
  const create$1 = (strokeColor, fillColor, alphaResolution) => {
    if (alphaResolution === 1) {
      return {
        stroke: parseStroke(strokeColor),
        fill: parseFill(fillColor),
      };
    }
    let stroke;
    if (strokeColor === null) {
      stroke = () => p5Extension.p.noStroke();
    } else if (strokeColor === undefined) {
      stroke = emptyFunction$1;
    } else {
      const strokeAlphaColor = create(strokeColor, alphaResolution);
      stroke = (alpha) => p5Extension.p.stroke(get(strokeAlphaColor, alpha));
    }
    let fill;
    if (fillColor === null) {
      fill = () => p5Extension.p.noFill();
    } else if (fillColor === undefined) {
      fill = emptyFunction$1;
    } else {
      const fillAlphaColor = create(fillColor, alphaResolution);
      fill = (alpha) => p5Extension.p.fill(get(fillAlphaColor, alpha));
    }
    return { stroke, fill };
  };
  const apply = (shapeColor, alpha) => {
    if (alpha < 1) {
      p5Extension.p.noStroke();
      p5Extension.p.noFill();
      return;
    }
    shapeColor.stroke(alpha);
    shapeColor.fill(alpha);
  };
  const shapeColor = Object.freeze({
    __proto__: null,
    create: create$1,
    apply: apply,
  });
  const createPixels = (drawCallback) => {
    p5Extension.p.push();
    drawCallback();
    p5Extension.p.pop();
    p5Extension.p.loadPixels();
    return p5Extension.p.pixels;
  };
  const replaceCanvasPixels = (pixels) => {
    p5Extension.p.pixels = pixels;
    p5Extension.p.updatePixels();
  };
  const drawTranslated = (drawCallback, offsetX, offsetY) => {
    p5Extension.p.translate(offsetX, offsetY);
    drawCallback();
    p5Extension.p.translate(-offsetX, -offsetY);
  };
  const drawRotated = (drawCallback, angle) => {
    p5Extension.p.rotate(angle);
    drawCallback();
    p5Extension.p.rotate(-angle);
  };
  const drawTranslatedAndRotated = (drawCallback, offsetX, offsetY, angle) => {
    p5Extension.p.translate(offsetX, offsetY);
    drawRotated(drawCallback, angle);
    p5Extension.p.translate(-offsetX, -offsetY);
  };
  const drawScaled = (drawCallback, scaleFactor) => {
    p5Extension.p.scale(scaleFactor);
    drawCallback();
    p5Extension.p.scale(1 / scaleFactor);
  };
  const drawTransformed = (
    drawCallback,
    offsetX,
    offsetY,
    angle,
    scaleFactor
  ) => {
    p5Extension.p.translate(offsetX, offsetY);
    p5Extension.p.rotate(angle);
    p5Extension.p.scale(scaleFactor);
    drawCallback();
    p5Extension.p.scale(1 / scaleFactor);
    p5Extension.p.rotate(-angle);
    p5Extension.p.translate(-offsetX, -offsetY);
  };
  const drawPath = (path) => {
    const { controlPoint1, controlPoint2, targetPoint } = path;
    p5Extension.p.bezierVertex(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      targetPoint.x,
      targetPoint.y
    );
  };
  const drawBezierCurve = (curve) => {
    const { startPoint, paths } = curve;
    p5Extension.p.vertex(startPoint.x, startPoint.y);
    creativeCodingCore.ArrayUtility.loop(paths, drawPath);
  };
  const drawControlLine = (vertex) => {
    const { point, controlLine } = vertex;
    const { x, y } = point;
    const controlPointOffset = creativeCodingCore.Vector2D.fromPolar(
      0.5 * controlLine.length,
      controlLine.angle
    );
    const controlX = controlPointOffset.x;
    const controlY = controlPointOffset.y;
    p5Extension.p.line(x - controlX, y - controlY, x + controlX, y + controlY);
  };
  const drawBezierControlLines = (vertices) => {
    creativeCodingCore.ArrayUtility.loop(vertices, drawControlLine);
  };
  const graphicsToImage = (graphics) => {
    const g = graphics;
    const { width, height } = g;
    const image = p5Extension.p.createImage(width, height);
    image.copy(graphics, 0, 0, width, height, 0, 0, width, height);
    return image;
  };
  let shakeFactor = 0;
  let shakeDecayFactor = 0;
  let shakeType = "DEFAULT";
  const setShake = (
    initialFactor,
    decayFactor,
    type = "DEFAULT",
    force = false
  ) => {
    if (decayFactor >= 1) return;
    if (!force && shakeFactor !== 0) return;
    shakeFactor = initialFactor;
    shakeDecayFactor = decayFactor;
    shakeType = type;
  };
  const applyShake = () => {
    if (shakeFactor === 0) return;
    const { width, height } = p5Extension.canvas.logicalSize;
    const xShake =
      shakeType === "VERTICAL"
        ? 0
        : creativeCodingCore.Random.signed(shakeFactor * width);
    const yShake =
      shakeType === "HORIZONTAL"
        ? 0
        : creativeCodingCore.Random.signed(shakeFactor * height);
    p5Extension.p.translate(xShake, yShake);
    shakeFactor *= shakeDecayFactor;
    if (shakeFactor < 0.001) shakeFactor = 0;
  };
  const TWO_PI = creativeCodingCore.Math.TWO_PI;
  const line = (from, to) => p5Extension.p.line(from.x, from.y, to.x, to.y);
  const lineWithMargin = (from, to, margin) => {
    const angle = creativeCodingCore.Angle.between(from, to);
    const offsetX = margin * Math.cos(angle);
    const offsetY = margin * Math.sin(angle);
    return p5Extension.p.line(
      from.x + offsetX,
      from.y + offsetY,
      to.x - offsetX,
      to.y - offsetY
    );
  };
  const lineAtOrigin = (destination) =>
    p5Extension.p.line(0, 0, destination.x, destination.y);
  const circleAtOrigin = (size) => p5Extension.p.circle(0, 0, size);
  const arcAtOrigin = (width, height, startRatio, endRatio, mode, detail) =>
    p5Extension.p.arc(
      0,
      0,
      width,
      height,
      startRatio * TWO_PI,
      endRatio * TWO_PI,
      mode,
      detail
    );
  const circularArcAtOrigin = (size, startRatio, endRatio, mode, detail) =>
    p5Extension.p.arc(
      0,
      0,
      size,
      size,
      startRatio * TWO_PI,
      endRatio * TWO_PI,
      mode,
      detail
    );
  const logicalPosition = { x: 0, y: 0 };
  const updatePosition = () => {
    if (!p5Extension.canvas) return;
    const factor = 1 / p5Extension.canvas.scaleFactor;
    logicalPosition.x = factor * p5Extension.p.mouseX;
    logicalPosition.y = factor * p5Extension.p.mouseY;
  };
  const emptyCallback = () => true;
  const stopCallback = () => false;
  const createEventHandler = (handler) => {
    return {
      onClicked: handler.onClicked || emptyCallback,
      onPressed: handler.onPressed || emptyCallback,
      onReleased: handler.onReleased || emptyCallback,
      onMoved: handler.onMoved || emptyCallback,
    };
  };
  const topEventHandler = createEventHandler({});
  const eventHandlerStack = creativeCodingCore.ArrayList.create(32);
  const bottomEventHandler = createEventHandler({});
  const addEventHandler = (handler) => {
    const createdHandler = createEventHandler(handler);
    creativeCodingCore.ArrayList.add(eventHandlerStack, createdHandler);
    return createdHandler;
  };
  const runCallback = (callback) => callback(logicalPosition);
  const createGetCallback = (event) => {
    switch (event) {
      case 0:
        return (handler) => handler.onClicked;
      case 1:
        return (handler) => handler.onPressed;
      case 2:
        return (handler) => handler.onReleased;
      case 3:
        return (handler) => handler.onMoved;
    }
  };
  const createOnEvent = (event) => {
    const getCallback = createGetCallback(event);
    return () => {
      const runNext = runCallback(getCallback(topEventHandler));
      if (!runNext) return;
      const handlers = eventHandlerStack.array;
      let index = eventHandlerStack.size - 1;
      while (index >= 0) {
        const runNext = runCallback(getCallback(handlers[index]));
        if (!runNext) break;
        index -= 1;
      }
      runCallback(getCallback(bottomEventHandler));
    };
  };
  const onClicked = createOnEvent(0);
  const onPressed = createOnEvent(1);
  const onReleased = createOnEvent(2);
  const onMoved = createOnEvent(3);
  const mouse = Object.freeze({
    __proto__: null,
    logicalPosition: logicalPosition,
    updatePosition: updatePosition,
    emptyCallback: emptyCallback,
    stopCallback: stopCallback,
    createEventHandler: createEventHandler,
    topEventHandler: topEventHandler,
    eventHandlerStack: eventHandlerStack,
    bottomEventHandler: bottomEventHandler,
    addEventHandler: addEventHandler,
    onClicked: onClicked,
    onPressed: onPressed,
    onReleased: onReleased,
    onMoved: onMoved,
  });
  const anyKeyIsDown = (keyCodes) => {
    for (const keyCode of keyCodes) {
      if (p5Extension.p.keyIsDown(keyCode)) return true;
    }
    return false;
  };
  const keyboard = Object.freeze({
    __proto__: null,
    anyKeyIsDown: anyKeyIsDown,
  });
  let horizontalMove = 0;
  let verticalMove = 0;
  const unitVector = { x: 0, y: 0 };
  let up = false;
  let left = false;
  let down = false;
  let right = false;
  const ONE_FRAC_ROOT_TWO = 1 / Math.sqrt(2);
  const setVec = (x, y) =>
    creativeCodingCore.MutableVector2D.setCartesian(unitVector, x, y);
  const update = () => {
    horizontalMove = (left ? -1 : 0) + (right ? 1 : 0);
    verticalMove = (up ? -1 : 0) + (down ? 1 : 0);
    switch (horizontalMove) {
      case -1:
        switch (verticalMove) {
          case -1:
            setVec(-ONE_FRAC_ROOT_TWO, -ONE_FRAC_ROOT_TWO);
            break;
          case 0:
            setVec(-1, 0);
            break;
          case 1:
            setVec(-ONE_FRAC_ROOT_TWO, ONE_FRAC_ROOT_TWO);
            break;
        }
        break;
      case 0:
        switch (verticalMove) {
          case -1:
            setVec(0, -1);
            break;
          case 0:
            setVec(0, 0);
            break;
          case 1:
            setVec(0, 1);
            break;
        }
        break;
      case 1:
        switch (verticalMove) {
          case -1:
            setVec(ONE_FRAC_ROOT_TWO, -ONE_FRAC_ROOT_TWO);
            break;
          case 0:
            setVec(1, 0);
            break;
          case 1:
            setVec(ONE_FRAC_ROOT_TWO, ONE_FRAC_ROOT_TWO);
            break;
        }
        break;
    }
  };
  const onPressed$1 = () => {
    switch (p5Extension.p.key) {
      case "w":
        up = true;
        break;
      case "a":
        left = true;
        break;
      case "s":
        down = true;
        break;
      case "d":
        right = true;
        break;
    }
    switch (p5Extension.p.keyCode) {
      case 38:
        up = true;
        break;
      case 37:
        left = true;
        break;
      case 40:
        down = true;
        break;
      case 39:
        right = true;
        break;
    }
    update();
  };
  const onReleased$1 = () => {
    switch (p5Extension.p.key) {
      case "w":
        up = false;
        break;
      case "a":
        left = false;
        break;
      case "s":
        down = false;
        break;
      case "d":
        right = false;
        break;
    }
    switch (p5Extension.p.keyCode) {
      case 38:
        up = false;
        break;
      case 37:
        left = false;
        break;
      case 40:
        down = false;
        break;
      case 39:
        right = false;
        break;
    }
    update();
  };
  const moveKeys = Object.freeze({
    __proto__: null,
    get horizontalMove() {
      return horizontalMove;
    },
    get verticalMove() {
      return verticalMove;
    },
    unitVector: unitVector,
    get up() {
      return up;
    },
    get left() {
      return left;
    },
    get down() {
      return down;
    },
    get right() {
      return right;
    },
    onPressed: onPressed$1,
    onReleased: onReleased$1,
  });
  let paused = false;
  const pauseOrResume = () => {
    if (paused) {
      p5Extension.p.loop();
      paused = false;
    } else {
      p5Extension.p.noLoop();
      paused = true;
    }
  };
  const createScaledCanvas = (node, logicalSize, fittingOption, renderer) => {
    const maxCanvasSize = creativeCodingCore.HtmlUtility.getElementSize(
      typeof node === "string"
        ? creativeCodingCore.HtmlUtility.getElementOrBody(node)
        : node
    );
    const scaleFactor =
      fittingOption !== null
        ? creativeCodingCore.FitBox.calculateScaleFactor(
            logicalSize,
            maxCanvasSize,
            fittingOption
          )
        : 1;
    const p5Canvas = p5Extension.p.createCanvas(
      scaleFactor * logicalSize.width,
      scaleFactor * logicalSize.height,
      renderer
    );
    const drawScaledFunction =
      scaleFactor !== 1
        ? (drawCallback) => drawScaled(drawCallback, scaleFactor)
        : (drawCallback) => drawCallback();
    return {
      p5Canvas,
      scaleFactor,
      logicalSize,
      logicalRegion: creativeCodingCore.RectangleRegion.create(
        creativeCodingCore.Vector2D.zero,
        logicalSize
      ),
      drawScaled: drawScaledFunction,
      logicalCenterPosition: {
        x: logicalSize.width / 2,
        y: logicalSize.height / 2,
      },
    };
  };
  const startSketch = (settings) => {
    const htmlElement =
      typeof settings.htmlElement === "string"
        ? creativeCodingCore.HtmlUtility.getElementOrBody(settings.htmlElement)
        : settings.htmlElement;
    new p5((p) => {
      p.prototype = p5.prototype;
      setP5Instance(p);
      p.setup = () => {
        setCanvas(
          createScaledCanvas(
            htmlElement,
            settings.logicalCanvasSize,
            settings.fittingOption
          )
        );
        settings.onSetup(p);
        settings.initialize();
      };
      settings.setP5Methods(p);
    }, htmlElement);
  };

  p5Extension.AlphaColor = alphaColor;
  p5Extension.KeyBoard = keyboard;
  p5Extension.Mouse = mouse;
  p5Extension.MoveKeys = moveKeys;
  p5Extension.ShapeColor = shapeColor;
  p5Extension.applyShake = applyShake;
  p5Extension.arcAtOrigin = arcAtOrigin;
  p5Extension.circleAtOrigin = circleAtOrigin;
  p5Extension.circularArcAtOrigin = circularArcAtOrigin;
  p5Extension.colorWithAlpha = colorWithAlpha;
  p5Extension.createPixels = createPixels;
  p5Extension.createScaledCanvas = createScaledCanvas;
  p5Extension.drawBezierControlLines = drawBezierControlLines;
  p5Extension.drawBezierCurve = drawBezierCurve;
  p5Extension.drawRotated = drawRotated;
  p5Extension.drawScaled = drawScaled;
  p5Extension.drawTransformed = drawTransformed;
  p5Extension.drawTranslated = drawTranslated;
  p5Extension.drawTranslatedAndRotated = drawTranslatedAndRotated;
  p5Extension.graphicsToImage = graphicsToImage;
  p5Extension.line = line;
  p5Extension.lineAtOrigin = lineAtOrigin;
  p5Extension.lineWithMargin = lineWithMargin;
  p5Extension.parseColor = parseColor;
  p5Extension.parseFill = parseFill;
  p5Extension.parseStroke = parseStroke;
  p5Extension.pauseOrResume = pauseOrResume;
  p5Extension.replaceCanvasPixels = replaceCanvasPixels;
  p5Extension.setCanvas = setCanvas;
  p5Extension.setP5Instance = setP5Instance;
  p5Extension.setShake = setShake;
  p5Extension.startSketch = startSketch;

  document.dispatchEvent(p5ExtensionLoaded);
});
