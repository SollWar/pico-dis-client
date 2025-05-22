// ----------------------------------------------
// Документация по методам RNNoise WASM:
//
// bExports.newState()       -> возвращает указатель на внутреннее состояние RNNoise
// bExports.deleteState(ptr) -> освобождает состояние, переданный указатель
// bExports.getInput(ptr)    -> возвращает смещение (в байтах) входного буфера во внутренней памяти
// bExports.pipe(ptr, len)   -> запускает шумоподавление на `len` сэмплах,
//                             возвращает смещение (в байтах) начала выходного буфера
// bExports.getVadProb(ptr)  -> (опционально) возвращает вероятность речи в текущем состоянии
// bExports.memory           -> экспорт памяти WebAssembly (ArrayBuffer)
//
// Применение gain:
// После обработки фрейма RNNoise вы можете усилить или ослабить сигнал,
// умножив каждую выборку на коэффициент gain:
//   cleanFrame[i] *= gain;
// Это не изменяет глубину шумоподавления, но меняет относительную громкость речи к шуму.
//
// ----------------------------------------------

// rnnoise-runtime.js (VAD отключён, поддержка gain)
'use strict'
{
  const g = (() => {
      const m =
        document.currentScript && document.currentScript.src.match(/^(.*\/)/)
      return m ? m[1] : './'
    })(),
    h = (
      WebAssembly.compileStreaming ||
      (async (a) => await WebAssembly.compile(await (await a).arrayBuffer()))
    )(fetch(g + 'rnnoise-processor.wasm'))
  let k

  window.RNNoiseNode = class extends AudioWorkletNode {
    // register with optional initial gain
    static async register(audioContext) {
      k = await h
      await audioContext.audioWorklet.addModule(g + 'rnnoise-processor.js')
    }

    constructor(audioContext, options = {}) {
      const gain = options.gain ?? 1.0
      super(audioContext, 'rnnoise', {
        channelCountMode: 'explicit',
        channelCount: 1,
        channelInterpretation: 'speakers',
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: { module: k, gain },
      })
      /**
       * Изменение коэффициента усиления в реальном времени:
       * node.updateGain(newGain)
       */
      this.updateGain = (newGain) => this.port.postMessage({ gain: newGain })
    }
  }
}
