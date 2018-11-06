/* eslint-disable react/no-unused-state, react/no-array-index-key */
import React, { Component } from 'react'
import cx from 'classnames'
import Synth from './Synth'

import NOTES from './notes'

const getNotesForOctave = octave =>
  Object.keys(NOTES).reduce((state, note) => {
    if (note.split('').pop() === String(octave)) state[note] = NOTES[note]
    return state
  }, {})

const defaultPads = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0]
]

class Sequencer extends Component {
  state = {
    type: 'sine',
    pads: defaultPads,
    bpm: 150,
    release: 100,
    step: 0,
    steps: 8,
    playing: false,
    octave: 4,
    delay: false,
    notes: getNotesForOctave(4)
  }

  changeRelease(release) {
    this.setState(
      {
        release
      },
      () => {
        this.pause()

        if (this.state.playing) this.play()
      }
    )
  }

  changeBPM(bpm) {
    if (bpm > 300 || bpm < 60) return

    this.setState(
      () => ({
        bpm
      }),
      () => {
        this.pause()

        if (this.state.playing) this.play()
      }
    )
  }

  changeWaveType(type) {
    this.setState(
      () => ({
        type
      }),
      () => {
        this.pause()

        if (this.state.playing) this.play()
      }
    )
  }

  changeOctave(octave) {
    this.setState(
      {
        octave: Number(octave),
        notes: getNotesForOctave(Number(octave))
      },
      () => {
        this.pause()

        if (this.state.playing) this.play()
      }
    )
  }

  play() {
    this.synth = new Synth()

    const { bpm, notes, type, release, delay } = this.state
    const notesArray = Object.keys(notes).map(key => notes[key])

    this.setState(() => ({
      playing: true
    }))

    this.interval = setInterval(() => {
      this.setState(
        state => ({
          step: state.step < state.steps - 1 ? state.step + 1 : 0
        }),
        () => {
          const next = this.state.pads[this.state.step]
            .map((pad, i) => (pad === 1 ? notesArray[i] : null))
            .filter(x => x)

          this.synth.playNotes(next, {
            release,
            bpm,
            type,
            delay
          })
        }
      )
    }, (60 * 1000) / this.state.bpm / 2)
  }

  pause() {
    this.setState(() => ({
      playing: false,
      step: 0
    }))

    clearInterval(this.interval)
  }

  togglePad(group, pad) {
    this.setState(state => {
      const clonedPads = state.pads.slice(0)
      const padState = clonedPads[group][pad]

      clonedPads[group] = [0, 0, 0, 0, 0, 0, 0, 0]
      clonedPads[group][pad] = padState === 1 ? 0 : 1
      return {
        pads: clonedPads
      }
    })
  }

  render() {
    const { pads, step, notes } = this.state

    return (
      <React.StrictMode>
        <div className="container">
          <header>
            <h1>React Sequencer</h1>
          </header>

          <div className="Sequencer">
            <div className="buttons">
              <button
                type="button"
                className={this.state.playing ? 'active' : ''}
                onClick={() => {
                  if (this.state.playing) this.pause()
                  else this.play()
                }}
              >
                Play
              </button>

              <div className="select-wrapper">
                <span>BPM</span>
                <input
                  type="number"
                  min="80"
                  max="300"
                  step="1"
                  defaultValue={this.state.bpm}
                  onChange={e => this.changeBPM(e.target.value)}
                />
              </div>

              <div className="select-wrapper">
                <span>Wave</span>
                <select
                  value={this.state.type}
                  data-label="wave"
                  className="wave"
                  onChange={e => this.changeWaveType(e.target.value)}
                >
                  <option>Sine</option>
                  <option>Square</option>
                  <option>Sawtooth</option>
                  <option>Triangle</option>
                </select>
              </div>

              <div className="select-wrapper">
                <span>Octave</span>
                <select
                  value={this.state.octave}
                  data-label="octave"
                  className="octave"
                  onChange={e => this.changeOctave(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </select>
              </div>

              <div className="select-wrapper">
                <span>Release</span>
                <input
                  type="number"
                  min="0"
                  max="400"
                  step="1"
                  defaultValue={this.state.release}
                  onChange={e => this.changeRelease(e.target.value)}
                />
              </div>

              <button
                type="button"
                className={cx({ active: this.state.delay })}
                onClick={() => {
                  this.setState(
                    state => ({
                      delay: !state.delay
                    }),
                    () => {
                      this.pause()
                      if (this.state.playing) this.play()
                    }
                  )
                }}
              >
                Delay
              </button>
            </div>

            <ul className="notes">
              {Object.keys(notes)
                .slice(0, 8)
                .reverse()
                .map(note => (
                  <li key={`note-${note}`}>{note.slice(0, note.length - 1)}</li>
                ))}
            </ul>

            <div className="flex">
              {pads.map((group, groupIndex) => (
                <div key={`pad-${groupIndex}`} className="pads">
                  {group.map((pad, i) => (
                    <div
                      key={`pad-group-${i}`}
                      className={cx('pad', {
                        active: groupIndex === step,
                        on: pad === 1
                      })}
                      onClick={() => {
                        this.togglePad(groupIndex, i)
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <footer>
            Made by{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://markmurray.co"
            >
              Mark Murray
            </a>
            . View the source on{' '}
            <a href="https://github.com/markmur/react-sequencer">Github</a>.
          </footer>
        </div>
      </React.StrictMode>
    )
  }
}

export default Sequencer
