'use strict'
{
  let bExports, memoryView

  registerProcessor(
    'rnnoise',
    class extends AudioWorkletProcessor {
      constructor(options) {
        super({
          ...options,
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        })
        bExports = new WebAssembly.Instance(options.processorOptions.module)
          .exports
        memoryView = new Float32Array(bExports.memory.buffer)
        this.state = bExports.newState()
        // Устанавливаем исходный gain из options или 1.0
        this.gain = options.processorOptions.gain ?? 1.0

        // Слушаем сообщения для обновления gain
        this.port.onmessage = ({ data }) => {
          if (typeof data.gain === 'number') {
            this.gain = data.gain
          }
        }
      }

      process(inputs, outputs) {
        if (!inputs[0] || !inputs[0][0]) return true
        const inp = inputs[0][0]
        const outp = outputs[0][0]

        // Копируем входные данные
        memoryView.set(inp, bExports.getInput(this.state) / 4)

        // Обработка RNNoise
        const got = bExports.pipe(this.state, outp.length) / 4
        if (got) {
          // Извлечение фрейма
          const frame = memoryView.subarray(got, got + outp.length)
          // Применяем gain
          for (let i = 0; i < frame.length; i++) {
            outp[i] = frame[i] * this.gain
          }
        }

        return true
      }

      // Освобождение состояния при завершении
      // (необязательно, но полезно)
      shutdown() {
        bExports.deleteState(this.state)
      }
    }
  )
}
