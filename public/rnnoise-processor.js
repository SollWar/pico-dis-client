'use strict'
{
  let b, d
  registerProcessor(
    'rnnoise',
    class extends AudioWorkletProcessor {
      constructor(a) {
        super({
          ...a,
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        })
        b ||
          (d = new Float32Array(
            (b = new WebAssembly.Instance(a.processorOptions.module)
              .exports).memory.buffer
          ))
        this.state = b.newState()
        this.alive = !0
        // this.port.onmessage = ({ data: a }) => {
        //   this.alive &&
        //     (a
        //       ? this.port.postMessage({ vadProb: b.getVadProb(this.state) })
        //       : ((this.alive = !1), b.deleteState(this.state)))
        // }
        this.sampleCounter = 0
        this.samplesPerUpdate = Math.floor(sampleRate / 50) // ~20ms
      }
      process(inputs, outputs) {
        if (!this.alive) return false
        const inp = inputs[0][0]
        const outp = outputs[0][0]
        // Заполняем буферы
        d.set(inp, b.getInput(this.state) / 4)
        const got = b.pipe(this.state, outp.length) / 4
        if (got) outp.set(d.subarray(got, got + outp.length))
        // Отсчитываем сэмплы и раз в ~20 ms шлём VAD
        this.sampleCounter += outp.length
        if (this.sampleCounter >= this.samplesPerUpdate) {
          this.sampleCounter -= this.samplesPerUpdate
          this.port.postMessage({ vadProb: b.getVadProb(this.state) })
        }
        return true
      }
    }
  )
}
