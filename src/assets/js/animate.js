/**
 * JS动画
 * 
 * @date 2018/12/26
 */
// requestAnimationFrame 兼容IE9
const requestAnimationFrame = window.requestAnimationFrame || function (fn) {
  return setTimeout(fn, 1000 / 60)
}

function linearEasing (percentComplete) {
  return percentComplete
}

function swingEasing (percentComplete) {
  return 0.5 - Math.cos(percentComplete * Math.PI) / 2
}

function springEasing (percentComplete) {
  return 1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))
}

function easeOutBounce (percentComplete) {
  if (percentComplete < 1 / 2.75) {
    return (7.5625 * percentComplete * percentComplete)
  }
  if (percentComplete < 2 / 2.75) {
    return (7.5625 * (percentComplete -= 1.5 / 2.75) * percentComplete + 0.75)
  }
  if (percentComplete < 2.5 / 2.75) {
    return (7.5625 * (percentComplete -= 2.25 / 2.75) * percentComplete + 0.9375)
  }

  return (7.5625 * (percentComplete -= 2.625 / 2.75) * percentComplete + 0.984375)
}

function easeInBounce (percentComplete) {
  return 1 - easeOutBounce(1 - percentComplete)
}

function easeInOutBounce (percentComplete) {
  return percentComplete < 0.5
    ? easeInBounce(percentComplete * 2) * 0.5
    : easeOutBounce(percentComplete * 2 - 1) * 0.5 + 0.5
}

function backInGenerater (amount) {
  amount = amount || 1.7
  return function (percentComplete) {
    return Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount)
  }
}

function backOutGenerater (amount) {
  amount = amount || 1.7
  return function (percentComplete) {
    return Math.pow(--percentComplete, 2) * ((amount + 1) * percentComplete + amount) + 1
  }
}

function backInOutGenerater (amount) {
  amount = amount || 1.7
  return function (percentComplete) {
    percentComplete *= 2
    return (percentComplete < 1
      ? (Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount))
      : (Math.pow(percentComplete - 2, 2) * ((amount + 1) * (percentComplete - 2) + amount) + 2)
    ) * 0.5
  }
}

function elasticInGenerater (amplitude, period) {
  const PI2 = Math.PI * 2
  return function (percentComplete) {
    return -amplitude * Math.pow(2, 10 * (percentComplete -= 1)) * Math.sin((percentComplete - (period / PI2 * Math.asin(1 / amplitude))) * PI2 / period)
  }
}

function elasticOutGenerater (amplitude, period) {
  const PI2 = Math.PI * 2
  return function (percentComplete) {
    return amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - (period / PI2 * Math.asin(1 / amplitude))) * PI2 / period) + 1
  }
}
function elasticInOutGenerater (amplitude, period) {
  const PI2 = Math.PI * 2
  return function (percentComplete) {
    const s = period / PI2 * Math.asin(1 / amplitude)
    percentComplete = percentComplete * 2 - 1
    return percentComplete < 0
      ? -0.5 * (amplitude * Math.pow(2, 10 * percentComplete) * Math.sin((percentComplete - s) * PI2 / period))
      : amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - s) * PI2 / period) * 0.5 + 1
  }
}

function stepGenerater (steps) {
  steps = steps || 3
  return function (percentComplete) {
    return Math.round(percentComplete * steps) * (1 / steps)
  }
}

function bezierGenerater (mX1, mY1, mX2, mY2) {
  const NEWTON_ITERATIONS = 4
  const NEWTON_MIN_SLOPE = 0.001
  const SUBDIVISION_PRECISION = 0.0000001
  const SUBDIVISION_MAX_ITERATIONS = 10
  const kSplineTableSize = 11
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)
  const float32ArraySupported = typeof Float32Array === 'function'
  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1 }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1 }
  function C (aA1) { return 3.0 * aA1 }
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT }
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1) }
  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    let currentX
    let currentT
    let i = 0
    do {
      currentT = aA + (aB - aA) / 2.0
      currentX = calcBezier(currentT, mX1, mX2) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
    return currentT
  }
  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      let currentSlope = getSlope(aGuessT, mX1, mX2)
      if (currentSlope === 0.0) {
        return aGuessT
      }
      let currentX = calcBezier(aGuessT, mX1, mX2) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }

  if (!(mX1 >= 0 && mX1 <= 1 && mX2 >= 0 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range')
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return linearEasing
  }

  let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize)
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
  }

  function getTForX (aX) {
    let intervalStart = 0.0
    let currentSample = 1
    let lastSample = kSplineTableSize - 1

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize
    }
    --currentSample

    // Interpolate to provide an initial guess for t
    let dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample])
    let guessForT = intervalStart + dist * kSampleStepSize

    let initialSlope = getSlope(guessForT, mX1, mX2)
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
    } else if (initialSlope === 0.0) {
      return guessForT
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2)
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }
    return calcBezier(getTForX(x), mY1, mY2)
  }
}

export default {
  generaters: {
    backInGenerater: backInGenerater,
    backOutGenerater: backOutGenerater,
    backInOutGenerater: backInOutGenerater,
    bezierGenerater: bezierGenerater
  },
  functions: {
    linearEasing: linearEasing,
    swingEasing: swingEasing,
    springEasing: springEasing,
    easeOutBounce: easeOutBounce,
    easeInBounce: easeInBounce,
    easeInOutBounce: easeInOutBounce,
    backIn: backInGenerater(1.7),
    backOut: backOutGenerater(1.7),
    backInOut: backInOutGenerater(1.7),
    elasticIn: elasticInGenerater(1, 0.3),
    elasticOut: elasticOutGenerater(1, 0.3),
    elasticInOut: elasticInOutGenerater(1, 0.3),
    step: stepGenerater(3),
    ease: bezierGenerater(0.25, 0.1, 0.25, 1),
    easeIn: bezierGenerater(0.42, 0, 1, 1),
    easeOut: bezierGenerater(0, 0, 0.58, 1),
    easeInOut: bezierGenerater(0.42, 0, 0.58, 1),
    easeInSine: bezierGenerater(0.47, 0, 0.745, 0.715),
    easeOutSine: bezierGenerater(0.39, 0.575, 0.565, 1),
    easeInOutSine: bezierGenerater(0.445, 0.05, 0.55, 0.95),
    easeInQuad: bezierGenerater(0.55, 0.085, 0.68, 0.53),
    easeOutQuad: bezierGenerater(0.25, 0.46, 0.45, 0.94),
    easeInOutQuad: bezierGenerater(0.455, 0.03, 0.515, 0.955),
    easeInCubic: bezierGenerater(0.55, 0.055, 0.675, 0.19),
    easeOutCubic: bezierGenerater(0.215, 0.61, 0.355, 1),
    easeInOutCubic: bezierGenerater(0.645, 0.045, 0.355, 1),
    easeInQuart: bezierGenerater(0.895, 0.03, 0.685, 0.22),
    easeOutQuart: bezierGenerater(0.165, 0.84, 0.44, 1),
    easeInOutQuart: bezierGenerater(0.77, 0, 0.175, 1),
    easeInQuint: bezierGenerater(0.755, 0.05, 0.855, 0.06),
    easeOutQuint: bezierGenerater(0.23, 1, 0.32, 1),
    easeInOutQuint: bezierGenerater(0.86, 0, 0.07, 1),
    easeInExpo: bezierGenerater(0.95, 0.05, 0.795, 0.035),
    easeOutExpo: bezierGenerater(0.19, 1, 0.22, 1),
    easeInOutExpo: bezierGenerater(1, 0, 0, 1),
    easeInCirc: bezierGenerater(0.6, 0.04, 0.98, 0.335),
    easeOutCirc: bezierGenerater(0.075, 0.82, 0.165, 1),
    easeInOutCirc: bezierGenerater(0.785, 0.135, 0.15, 0.86)
  },
  /**
   * 开始动画
   * @param {Number} duration 动画持续时间（单位：毫秒）
   * @param {String|Function} func 动画函数名称或者动画函数
   * @param {Function} update 每一帧动画的执行方法\n
   *        value 当前函数计算结果，值范围[0,1]（取决于动画函数，不一定线性）
   *        percentComplete 当前进度，值范围[0,1](线性增长)
   *        data 开始动画时传入的数据
   * @param data 附带的数据，用于传给每帧动画执行的update函数
   */
  start: function (duration, func, update, data) {
    let startTime = new Date().getTime()
    let animateFuncion = typeof func === 'string' ? this.functions[func] : undefined
    let animateParams
    if (!animateFuncion && typeof func === 'object' && func.name) {
      animateParams = func.params
      if (animateParams && !(animateParams instanceof Array)) {
        animateParams = [animateParams]
      }
      animateFuncion = this.generaters[func.name + 'Generater'].apply(null, animateParams)
    }
    (function play () {
      let now = new Date().getTime()
      let percentComplete = (now - startTime) / duration
      if (percentComplete > 1) { percentComplete = 1 }
      let value = animateFuncion(percentComplete, animateParams)
      update(value, percentComplete, data)
      if (percentComplete < 1) {
        requestAnimationFrame(play)
      }
    })()
  }
}
