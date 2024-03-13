(() => {
  const loopRange = (array, callback, start, end) => {
    for (let i = start; i < end; i += 1) callback(array[i], i, array);
  };
  const loop = (array, callback) => loopRange(array, callback, 0, array.length);
  const loopRangeBackwards = (array, callback, start, end) => {
    let index = end;
    while (index > start) {
      --index;
      callback(array[index], index, array);
    }
  };
  const loopBackwards = (array, callback) =>
    loopRangeBackwards(array, callback, 0, array.length);
  const nestedLoopJoinWithRange = (
    arrayA,
    arrayB,
    callback,
    startA,
    endA,
    startB,
    endB
  ) => {
    for (let i = startA; i < endA; i += 1) {
      for (let k = startB; k < endB; k += 1) callback(arrayA[i], arrayB[k]);
    }
  };
  const nestedLoopJoin = (arrayA, arrayB, callback) =>
    nestedLoopJoinWithRange(
      arrayA,
      arrayB,
      callback,
      0,
      arrayA.length,
      0,
      arrayB.length
    );
  const roundRobinWithRange = (array, callback, start, end) => {
    const iLen = end - 1;
    for (let i = start; i < iLen; i += 1) {
      for (let k = i + 1; k < end; k += 1) callback(array[i], array[k]);
    }
  };
  const roundRobin = (array, callback) =>
    roundRobinWithRange(array, callback, 0, array.length);
  const flatNaive = (arrays) => [].concat(...arrays);
  const flatRecursive = (array, depth = 1) =>
    depth > 0
      ? array.reduce(
          (acc, cur) =>
            acc.concat(
              Array.isArray(cur) ? flatRecursive(cur, depth - 1) : cur
            ),
          []
        )
      : array;
  const populate = (array, factory, length) => {
    const len = length || array.length;
    for (let i = 0; i < len; i += 1) array[i] = factory();
    return array;
  };
  const arrayUtility = Object.freeze({
    __proto__: null,
    loopRange: loopRange,
    loop: loop,
    loopRangeBackwards: loopRangeBackwards,
    loopBackwards: loopBackwards,
    nestedLoopJoinWithRange: nestedLoopJoinWithRange,
    nestedLoopJoin: nestedLoopJoin,
    roundRobinWithRange: roundRobinWithRange,
    roundRobin: roundRobin,
    flatNaive: flatNaive,
    flatRecursive: flatRecursive,
    populate: populate,
  });
  const create = (initialCapacity) => {
    return {
      array: new Array(initialCapacity),
      size: 0,
    };
  };
  const createFilled = (size, value) => {
    return {
      array: new Array(size).fill(value),
      size,
    };
  };
  const createPopulated = (size, factory) => {
    return {
      array: populate(new Array(size), factory),
      size,
    };
  };
  const fromArray = (array) => {
    return {
      array,
      size: array.length,
    };
  };
  const add = (arrayList, element) => {
    arrayList.array[arrayList.size] = element;
    arrayList.size += 1;
  };
  const push = add;
  const pop = (arrayList) => {
    const lastIndex = arrayList.size - 1;
    const removedElement = arrayList.array[lastIndex];
    arrayList.size = lastIndex;
    return removedElement;
  };
  const clear = (arrayList) => {
    arrayList.size = 0;
  };
  const cleanUnusedSlots = (arrayList) => {
    const { array, size } = arrayList;
    const capacity = array.length;
    array.length = size;
    array.length = capacity;
  };
  const clearReference = (arrayList) => {
    arrayList.size = 0;
    cleanUnusedSlots(arrayList);
  };
  const loop$1 = (arrayList, callback) =>
    loopRange(arrayList.array, callback, 0, arrayList.size);
  const loopBackwards$1 = (arrayList, callback) =>
    loopRangeBackwards(arrayList.array, callback, 0, arrayList.size);
  const find = (arrayList, predicate) => {
    const { array, size } = arrayList;
    for (let i = 0; i < size; i += 1) {
      if (predicate(array[i], i, array)) return array[i];
    }
    return undefined;
  };
  const findIndex = (arrayList, element) => {
    const { array, size } = arrayList;
    for (let i = 0; i < size; i += 1) {
      if (array[i] === element) return i;
    }
    return -1;
  };
  const removeShift = (arrayList, index) => {
    const { array, size } = arrayList;
    const removedElement = array[index];
    array.copyWithin(index, index + 1, size);
    arrayList.size = size - 1;
    return removedElement;
  };
  const removeShiftElement = (arrayList, element) => {
    const index = findIndex(arrayList, element);
    if (index >= 0) return removeShift(arrayList, index);
    return null;
  };
  const removeSwap = (arrayList, index) => {
    const array = arrayList.array;
    const removedElement = array[index];
    const lastIndex = arrayList.size - 1;
    array[index] = array[lastIndex];
    arrayList.size = lastIndex;
    return removedElement;
  };
  const removeSwapElement = (arrayList, element) => {
    const index = findIndex(arrayList, element);
    if (index >= 0) return removeSwap(arrayList, index);
    return null;
  };
  const removeShiftAll = (arrayList, predicate) => {
    const { array, size } = arrayList;
    let writeIndex = 0;
    let found = false;
    for (let readIndex = 0; readIndex < size; readIndex += 1) {
      const value = array[readIndex];
      if (predicate(value, readIndex, array)) {
        found = true;
        continue;
      }
      array[writeIndex] = value;
      writeIndex += 1;
    }
    arrayList.size = writeIndex;
    return found;
  };
  const removeSwapAll = (arrayList, predicate) => {
    let found = false;
    const array = arrayList.array;
    for (let i = 0; i < arrayList.size; i += 1) {
      if (predicate(array[i], i, array)) {
        removeSwap(arrayList, i);
        found = true;
      }
    }
    return found;
  };
  const populate$1 = (arrayList, factory) => {
    populate(arrayList.array, factory);
    arrayList.size = arrayList.array.length;
    return arrayList;
  };
  const arrayList = Object.freeze({
    __proto__: null,
    create: create,
    createFilled: createFilled,
    createPopulated: createPopulated,
    fromArray: fromArray,
    add: add,
    push: push,
    pop: pop,
    clear: clear,
    cleanUnusedSlots: cleanUnusedSlots,
    clearReference: clearReference,
    loop: loop$1,
    loopBackwards: loopBackwards$1,
    find: find,
    findIndex: findIndex,
    removeShift: removeShift,
    removeShiftElement: removeShiftElement,
    removeSwap: removeSwap,
    removeSwapElement: removeSwapElement,
    removeShiftAll: removeShiftAll,
    removeSwapAll: removeSwapAll,
    populate: populate$1,
  });
  const create$1 = (factory) => {
    return {
      value: undefined,
      factory,
    };
  };
  const get = (object) => object.value || (object.value = object.factory());
  const clear$1 = (object) => {
    object.value = undefined;
  };
  const lazy = Object.freeze({
    __proto__: null,
    create: create$1,
    get: get,
    clear: clear$1,
  });
  const from = (prototypeStructure, length) => {
    const data = {};
    for (const key of Object.keys(prototypeStructure))
      data[key] = new Array(length).fill(prototypeStructure[key]);
    return {
      data,
      length,
    };
  };
  const structureOfArrays = Object.freeze({
    __proto__: null,
    from: from,
  });
  const sq = (v) => v * v;
  const cubic = (v) => v * v * v;
  const PI = Math.PI;
  const HALF_PI = PI / 2;
  const TWO_PI = 2 * PI;
  const nearlyEqual = (a, b) => Math.abs(a - b) < 0.0000000000001;
  const math = Object.freeze({
    __proto__: null,
    sq: sq,
    cubic: cubic,
    PI: PI,
    HALF_PI: HALF_PI,
    TWO_PI: TWO_PI,
    nearlyEqual: nearlyEqual,
  });
  const zero = {
    x: 0,
    y: 0,
  };
  const isZero = (v) => v.x === 0 && v.y === 0;
  const fromPolar = (length, angle) => {
    return {
      x: length * Math.cos(angle),
      y: length * Math.sin(angle),
    };
  };
  const add$1 = (a, b) => {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  };
  const addCartesian = (vector, x, y) => {
    return {
      x: vector.x + x,
      y: vector.y + y,
    };
  };
  const addPolar = (vector, length, angle) => {
    return {
      x: vector.x + length * Math.cos(angle),
      y: vector.y + length * Math.sin(angle),
    };
  };
  const subtract = (a, b) => {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
    };
  };
  const subtractCartesian = (vector, x, y) => {
    return {
      x: vector.x - x,
      y: vector.y - y,
    };
  };
  const subtractPolar = (vector, length, angle) => {
    return {
      x: vector.x - length * Math.cos(angle),
      y: vector.y - length * Math.sin(angle),
    };
  };
  const distanceSquared = (vectorA, vectorB) =>
    sq(vectorB.x - vectorA.x) + sq(vectorB.y - vectorA.y);
  const distance = (vectorA, vectorB) =>
    Math.sqrt(distanceSquared(vectorA, vectorB));
  const toStr = (vector) => `{x:${vector.x},y:${vector.y}}`;
  const vector2d = Object.freeze({
    __proto__: null,
    zero: zero,
    isZero: isZero,
    fromPolar: fromPolar,
    add: add$1,
    addCartesian: addCartesian,
    addPolar: addPolar,
    subtract: subtract,
    subtractCartesian: subtractCartesian,
    subtractPolar: subtractPolar,
    distanceSquared: distanceSquared,
    distance: distance,
    toStr: toStr,
  });
  const DEGREES_TO_RADIANS_FACTOR = TWO_PI / 360;
  const RADIANS_TO_DEGREES_FACTOR = 360 / TWO_PI;
  const createArray = (resolution) => {
    const array = new Array(resolution);
    const interval = TWO_PI / resolution;
    for (let i = 0; i < resolution; i += 1) array[i] = i * interval;
    return array;
  };
  const fromDegrees = (degrees) => DEGREES_TO_RADIANS_FACTOR * degrees;
  const toDegrees = (radians) => RADIANS_TO_DEGREES_FACTOR * radians;
  const fromOrigin = (position) =>
    isZero(position) ? 0 : Math.atan2(position.y, position.x);
  const between = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx === 0 && dy === 0) return 0;
    return Math.atan2(dy, dx);
  };
  const angle = Object.freeze({
    __proto__: null,
    createArray: createArray,
    fromDegrees: fromDegrees,
    toDegrees: toDegrees,
    fromOrigin: fromOrigin,
    between: between,
  });
  const create$2 = (topLeftPosition, size) => {
    return {
      topLeft: topLeftPosition,
      rightBottom: {
        x: topLeftPosition.x + size.width,
        y: topLeftPosition.y + size.height,
      },
    };
  };
  const containsPoint = (region, point, margin) => {
    const { topLeft, rightBottom } = region;
    const { x, y } = point;
    return (
      x >= topLeft.x + margin &&
      y >= topLeft.y + margin &&
      x < rightBottom.x - margin &&
      y < rightBottom.y - margin
    );
  };
  const rectangleRegion = Object.freeze({
    __proto__: null,
    create: create$2,
    containsPoint: containsPoint,
  });
  const getAspectRatio = (size) => size.width / size.height;
  const getArea = (size) => size.width * size.height;
  const rectangleSize = Object.freeze({
    __proto__: null,
    getAspectRatio: getAspectRatio,
    getArea: getArea,
  });
  const add$2 = (vector, sourceVector) => {
    vector.x += sourceVector.x;
    vector.y += sourceVector.y;
    return vector;
  };
  const addCartesian$1 = (vector, x, y) => {
    vector.x += x;
    vector.y += y;
    return vector;
  };
  const addPolar$1 = (vector, length, angle) => {
    vector.x += length * Math.cos(angle);
    vector.y += length * Math.sin(angle);
    return vector;
  };
  const subtract$1 = (vector, sourceVector) => {
    vector.x -= sourceVector.x;
    vector.y -= sourceVector.y;
    return vector;
  };
  const subtractCartesian$1 = (vector, x, y) => {
    vector.x -= x;
    vector.y -= y;
    return vector;
  };
  const subtractPolar$1 = (vector, length, angle) => {
    vector.x -= length * Math.cos(angle);
    vector.y -= length * Math.sin(angle);
    return vector;
  };
  const set = (vector, sourceVector) => {
    vector.x = sourceVector.x;
    vector.y = sourceVector.y;
    return vector;
  };
  const setCartesian = (vector, x, y) => {
    vector.x = x;
    vector.y = y;
    return vector;
  };
  const setPolar = (vector, length, angle) => {
    vector.x = length * Math.cos(angle);
    vector.y = length * Math.sin(angle);
    return vector;
  };
  const vector2dMutable = Object.freeze({
    __proto__: null,
    add: add$2,
    addCartesian: addCartesian$1,
    addPolar: addPolar$1,
    subtract: subtract$1,
    subtractCartesian: subtractCartesian$1,
    subtractPolar: subtractPolar$1,
    set: set,
    setCartesian: setCartesian,
    setPolar: setPolar,
  });
  const createCurve = (vertexPropertyList) => {
    const paths = [];
    const len = vertexPropertyList.length;
    let previousVertex = vertexPropertyList[0];
    let previousControlLine = previousVertex.controlLine;
    for (let i = 1; i < len; i += 1) {
      const currentVertex = vertexPropertyList[i];
      const currentControlLine = currentVertex.controlLine;
      paths.push({
        controlPoint1: addPolar(
          previousVertex.point,
          0.5 * previousControlLine.length,
          previousControlLine.angle
        ),
        controlPoint2: subtractPolar(
          currentVertex.point,
          0.5 * currentControlLine.length,
          currentControlLine.angle
        ),
        targetPoint: currentVertex.point,
      });
      previousVertex = currentVertex;
      previousControlLine = currentControlLine;
    }
    return {
      startPoint: vertexPropertyList[0].point,
      paths,
    };
  };
  const bezier = Object.freeze({
    __proto__: null,
    createCurve: createCurve,
  });
  const bind = (easingFunction) => (start, end, ratio) =>
    start + easingFunction(ratio) * (end - start);
  const concatenate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return (ratio) => {
      if (ratio < thresholdRatio)
        return easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return easingFunctionB((ratio - thresholdRatio) / ratioB);
      }
    };
  };
  const integrate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return (ratio) => {
      if (ratio < thresholdRatio)
        return thresholdRatio * easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return (
          thresholdRatio +
          ratioB * easingFunctionB((ratio - thresholdRatio) / ratioB)
        );
      }
    };
  };
  const easeLinear = (ratio) => ratio;
  const easeInQuad = sq;
  const easeOutQuad = (ratio) => -sq(ratio - 1) + 1;
  const easeInCubic = cubic;
  const easeOutCubic = (ratio) => cubic(ratio - 1) + 1;
  const easeInQuart = (ratio) => Math.pow(ratio, 4);
  const easeOutQuart = (ratio) => -Math.pow(ratio - 1, 4) + 1;
  const createEaseOutBack =
    (coefficient = 1.70158) =>
    (ratio) => {
      const r = ratio - 1;
      return (coefficient + 1) * cubic(r) + coefficient * sq(r) + 1;
    };
  const easeInOutQuad = integrate(easeInQuad, easeOutQuad);
  const easeOutInQuad = integrate(easeOutQuad, easeInQuad);
  const easeInOutCubic = integrate(easeInCubic, easeOutCubic);
  const easeOutInCubic = integrate(easeOutCubic, easeInCubic);
  const easeInOutQuart = integrate(easeInQuart, easeOutQuart);
  const easeOutInQuart = integrate(easeOutQuart, easeInQuart);
  const easing = Object.freeze({
    __proto__: null,
    bind: bind,
    concatenate: concatenate,
    integrate: integrate,
    easeLinear: easeLinear,
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    createEaseOutBack: createEaseOutBack,
    easeInOutQuad: easeInOutQuad,
    easeOutInQuad: easeOutInQuad,
    easeInOutCubic: easeInOutCubic,
    easeOutInCubic: easeOutInCubic,
    easeInOutQuart: easeInOutQuart,
    easeOutInQuart: easeOutInQuart,
  });
  const value = (max) => Math.random() * max;
  const angle$1 = () => Math.random() * TWO_PI;
  const between$1 = (start, end) => start + Math.random() * (end - start);
  const inRange = (range) => between$1(range.start, range.end);
  const integer = (maxInt) => Math.floor(Math.random() * maxInt);
  const integerBetween = (minInt, maxInt) => minInt + integer(maxInt - minInt);
  const signed = (n) => (Math.random() < 0.5 ? n : -n);
  const fromArray$1 = (array) => array[integer(array.length)];
  const removeFromArray = (array) => array.splice(integer(array.length), 1)[0];
  const bool = (probability) => Math.random() < probability;
  const random = Object.freeze({
    __proto__: null,
    value: value,
    angle: angle$1,
    between: between$1,
    inRange: inRange,
    integer: integer,
    integerBetween: integerBetween,
    signed: signed,
    fromArray: fromArray$1,
    removeFromArray: removeFromArray,
    bool: bool,
  });
  const calculateScaleFactor = (nonScaledSize, targetSize, fittingOption) => {
    switch (fittingOption) {
      default:
      case "FIT_TO_BOX":
        return Math.min(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case "FIT_WIDTH":
        return targetSize.width / nonScaledSize.width;
      case "FIT_HEIGHT":
        return targetSize.height / nonScaledSize.height;
    }
  };
  const fitBox = Object.freeze({
    __proto__: null,
    calculateScaleFactor: calculateScaleFactor,
  });
  const getElementOrBody = (id) => document.getElementById(id) || document.body;
  const getElementSize = (node) =>
    node === document.body
      ? {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : node.getBoundingClientRect();
  const htmlUtility = Object.freeze({
    __proto__: null,
    getElementOrBody: getElementOrBody,
    getElementSize: getElementSize,
  });
  const emptyListener = () => {};
  const create$3 = (
    duration,
    onProgress = emptyListener,
    onComplete = emptyListener
  ) => {
    return {
      duration,
      progressRatioChangeRate: 1 / duration,
      onProgress,
      onComplete,
      count: 0,
      progressRatio: 0,
      isCompleted: false,
    };
  };
  const dummy = create$3(0);
  const reset = (timerUnit) => {
    timerUnit.count = 0;
    timerUnit.progressRatio = 0;
    timerUnit.isCompleted = false;
  };
  const step = (timerUnit) => {
    if (timerUnit.isCompleted) return true;
    const { count, duration, progressRatioChangeRate } = timerUnit;
    if (count >= duration) {
      timerUnit.progressRatio = 1;
      timerUnit.onProgress(timerUnit);
      timerUnit.isCompleted = true;
      timerUnit.onComplete(timerUnit);
      return true;
    }
    timerUnit.onProgress(timerUnit);
    timerUnit.count += 1;
    timerUnit.progressRatio += progressRatioChangeRate;
    return false;
  };
  const addOnComplete = (timerUnit, onComplete) => {
    const newUnit = Object.assign({}, timerUnit);
    const oldOnComplete = timerUnit.onComplete;
    newUnit.onComplete = () => {
      oldOnComplete(newUnit);
      onComplete(newUnit);
    };
    return newUnit;
  };
  const step$1 = (chain) => {
    step(chain.current);
    return chain.isCompleted;
  };
  const setUnitIndex = (chain, index) => {
    chain.index = index;
    chain.current = chain.timers[index];
  };
  const reset$1 = (chain) => {
    loop(chain.timers, reset);
    setUnitIndex(chain, 0);
  };
  const next = (chain) => {
    setUnitIndex(chain, chain.index + 1);
    return chain.current;
  };
  const create$4 = (timers, looped = false) => {
    let newChain;
    const newTimers = new Array(timers.length);
    const shift = () => next(newChain);
    const lastIndex = timers.length - 1;
    for (let i = 0; i < lastIndex; i += 1) {
      newTimers[i] = addOnComplete(timers[i], shift);
    }
    if (looped)
      newTimers[lastIndex] = addOnComplete(timers[lastIndex], () =>
        reset$1(newChain)
      );
    else
      newTimers[lastIndex] = addOnComplete(
        timers[lastIndex],
        () => (newChain.isCompleted = true)
      );
    newChain = {
      timers: newTimers,
      current: newTimers[0],
      index: 0,
      isCompleted: false,
    };
    return newChain;
  };
  const dummy$1 = create$4([dummy]);
  const chain = Object.freeze({
    __proto__: null,
    step: step$1,
    setUnitIndex: setUnitIndex,
    reset: reset$1,
    next: next,
    create: create$4,
    dummy: dummy$1,
  });
  const create$5 = (capacity) => create(capacity);
  const addTimer = (timerSet, timer) => add(timerSet, () => step(timer));
  const addChain = (timerSet, chain$1) => add(timerSet, () => step$1(chain$1));
  const runStep = (step) => step();
  const step$2 = (timerSet) => {
    removeShiftAll(timerSet, runStep);
  };
  const clear$2 = (timerSet) => clearReference(timerSet);
  const set$1 = Object.freeze({
    __proto__: null,
    create: create$5,
    addTimer: addTimer,
    addChain: addChain,
    step: step$2,
    clear: clear$2,
  });
  const index = Object.freeze({
    __proto__: null,
    Chain: chain,
    Set: set$1,
    emptyListener: emptyListener,
    create: create$3,
    dummy: dummy,
    reset: reset,
    step: step,
    addOnComplete: addOnComplete,
  });
  const morseCodeMap = new Map([
    ["A", ".-"],
    ["B", "-..."],
    ["C", "-.-."],
    ["D", "-.."],
    ["E", "."],
    ["F", "..-."],
    ["G", "--."],
    ["H", "...."],
    ["I", ".."],
    ["J", ".---"],
    ["K", "-.-"],
    ["L", ".-.."],
    ["M", "--"],
    ["N", "-."],
    ["O", "---"],
    ["P", ".--."],
    ["Q", "--.-"],
    ["R", ".-."],
    ["S", "..."],
    ["T", "-"],
    ["U", "..-"],
    ["V", "...-"],
    ["W", ".--"],
    ["X", "-..-"],
    ["Y", "-.--"],
    ["Z", "--.."],
    ["1", ".----"],
    ["2", "..---"],
    ["3", "...--"],
    ["4", "....-"],
    ["5", "....."],
    ["6", "-...."],
    ["7", "--..."],
    ["8", "---.."],
    ["9", "----."],
    ["0", "-----"],
    [".", ".-.-.-"],
    [",", "--..--"],
    [":", "---..."],
    ["?", "..--.."],
    ["'", ".----."],
    ["!", "-.-.--"],
    ["-", "-....-"],
    ["/", "-..-."],
    ["@", ".--.-."],
    ["(", "-.--."],
    [")", "-.--.-"],
    ['"', ".-..-."],
    ["=", "-...-"],
    ["+", ".-.-."],
  ]);
  class Unit {
    constructor(isOn, length, codeString) {
      this.isOn = isOn;
      this.length = length;
      this.codeString = codeString;
      let s = "";
      const binaryCharacter = isOn ? "1" : "0";
      for (let i = 0; i < length; i += 1) {
        s += binaryCharacter;
      }
      this.binaryString = s;
    }
  }
  class On extends Unit {
    constructor(length, codeString) {
      super(true, length, codeString);
    }
  }
  class Off extends Unit {
    constructor(length, codeString) {
      super(false, length, codeString);
    }
  }
  const DIT = new On(1, ".");
  const DAH = new On(3, "-");
  const INTER_ELEMENT_GAP = new Off(1, "");
  const SHORT_GAP = new Off(3, " ");
  const MEDIUM_GAP = new Off(7, " / ");
  const NUL = new Off(0, "");
  function encode(sentence) {
    const upperCaseSentence = sentence.toUpperCase();
    const signals = [];
    let gap = undefined;
    for (let i = 0, len = upperCaseSentence.length; i < len; i += 1) {
      const character = upperCaseSentence.charAt(i);
      if (character === " ") {
        gap = MEDIUM_GAP;
        continue;
      } else if (character.charCodeAt(0) === 0) {
        if (gap) signals.push(gap);
        gap = undefined;
        signals.push(NUL);
        continue;
      }
      const code = morseCodeMap.get(character);
      if (!code) continue;
      for (let k = 0, kLen = code.length; k < kLen; k += 1) {
        if (gap) signals.push(gap);
        switch (code.charAt(k)) {
          case ".":
            signals.push(DIT);
            break;
          case "-":
          case "_":
            signals.push(DAH);
            break;
          default:
            continue;
        }
        gap = INTER_ELEMENT_GAP;
      }
      gap = SHORT_GAP;
    }
    return signals;
  }
  const toString = (signals) =>
    signals.reduce((acc, cur) => acc + cur.codeString, "");
  const toBinaryString = (signals) =>
    signals.reduce((acc, cur) => acc + cur.binaryString, "");
  const getTotalLength = (signals) =>
    signals.reduce((acc, cur) => acc + cur.length, 0);
  const signal = Object.freeze({
    __proto__: null,
    Unit: Unit,
    DIT: DIT,
    DAH: DAH,
    INTER_ELEMENT_GAP: INTER_ELEMENT_GAP,
    SHORT_GAP: SHORT_GAP,
    MEDIUM_GAP: MEDIUM_GAP,
    NUL: NUL,
    encode: encode,
    toString: toString,
    toBinaryString: toBinaryString,
    getTotalLength: getTotalLength,
  });
  function wpmToDotDuration(wpm) {
    return 1000 / (50 * (wpm / 60));
  }
  const create$6 = (on, off, wpm = 25, signals = [], loop = false) => {
    return {
      on,
      off,
      wpm,
      unitTime: wpmToDotDuration(wpm),
      loop,
      signals,
      index: 0,
      timeout: undefined,
    };
  };
  const stop = (channel) => {
    if (channel.timeout) {
      channel.off(NUL);
      clearTimeout(channel.timeout);
      channel.timeout = undefined;
    }
    channel.index = 0;
  };
  const runCurrentSignal = (channel) => {
    const { unitTime, signals, index, on, off } = channel;
    const currentSignal = signals[index];
    if (currentSignal.isOn) on(currentSignal);
    else off(currentSignal);
    return unitTime * currentSignal.length;
  };
  const setNextRun = (run, channel, ms) => {
    channel.timeout = setTimeout(() => {
      channel.timeout = undefined;
      run(channel);
    }, ms);
  };
  const run = (channel) => {
    const currentSignalTimeLength = runCurrentSignal(channel);
    channel.index += 1;
    if (channel.index < channel.signals.length) {
      setNextRun(run, channel, currentSignalTimeLength);
      return;
    }
    channel.timeout = setTimeout(() => {
      if (channel.loop) {
        channel.off(NUL);
        channel.timeout = undefined;
      } else {
        channel.off(MEDIUM_GAP);
        setNextRun(run, channel, MEDIUM_GAP.length);
      }
    }, currentSignalTimeLength);
    channel.index = 0;
  };
  const start = (channel, signals) => {
    stop(channel);
    if (signals) channel.signals = signals;
    run(channel);
  };
  const channel = Object.freeze({
    __proto__: null,
    wpmToDotDuration: wpmToDotDuration,
    create: create$6,
    stop: stop,
    start: start,
  });
  const index$1 = Object.freeze({
    __proto__: null,
    Signal: signal,
    Channel: channel,
  });

  window.creativeCodingCore = {};
  creativeCodingCore.Angle = angle;
  creativeCodingCore.ArrayList = arrayList;
  creativeCodingCore.ArrayUtility = arrayUtility;
  creativeCodingCore.Bezier = bezier;
  creativeCodingCore.Easing = easing;
  creativeCodingCore.FitBox = fitBox;
  creativeCodingCore.HtmlUtility = htmlUtility;
  creativeCodingCore.Lazy = lazy;
  creativeCodingCore.Math = math;
  creativeCodingCore.MorseCode = index$1;
  creativeCodingCore.MutableVector2D = vector2dMutable;
  creativeCodingCore.Random = random;
  creativeCodingCore.RectangleRegion = rectangleRegion;
  creativeCodingCore.RectangleSize = rectangleSize;
  creativeCodingCore.StructureOfArrays = structureOfArrays;
  creativeCodingCore.Timer = index;
  creativeCodingCore.Vector2D = vector2d;
})();
