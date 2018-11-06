export default class Synth {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
  }

  playNotes(notes = [], state = {}) {
    if (notes.length <= 0) return

    const osc = this.ctx.createOscillator()
    osc.type = state.type.toLowerCase()
    osc.frequency.value = notes[0]

    const delay = this.ctx.createDelay()
    delay.delayTime.value = state.delay ? state.bpm / 2000 : 0

    // VCA
    const vca = this.ctx.createGain()
    vca.gain.value = 1

    // Connections
    osc.connect(vca)
    vca.connect(delay)
    vca.connect(this.ctx.destination)
    delay.connect(this.ctx.destination)

    osc.start(0)

    setTimeout(() => {
      vca.gain.setTargetAtTime(0, this.ctx.currentTime, 0.015)
    }, state.release)
  }
}
