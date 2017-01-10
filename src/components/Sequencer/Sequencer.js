import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

const NOTES = {
"C0": 16.35,"C#0": 17.32,"D0": 18.35,"D#0": 19.45,"E0": 20.6,"F0": 21.83,"F#0": 23.12,"G0": 24.5,"G#0": 25.96,"A0": 27.5,"A#0": 29.14,"B0": 30.87,"C1": 32.7,"C#1": 34.65,"D1": 36.71,"D#1": 38.89,"E1": 41.2,"F1": 43.65,"F#1": 46.25,"G1": 49,"G#1": 51.91,"A1": 55,"A#1": 58.27,"B1": 61.74,"C2": 65.41,"C#2": 69.3,"D2": 73.42,"D#2": 77.78,"E2": 82.41,"F2": 87.31,"F#2": 92.5,"G2": 98,"G#2": 103.83,"A2": 110,"A#2": 116.54,"B2": 123.47,"C3": 130.81,"C#3": 138.59,"D3": 146.83,"D#3": 155.56,"E3": 164.81,"F3": 174.61,"F#3": 185,"G3": 196,"G#3": 207.65,"A3": 220,"A#3": 233.08,"B3": 246.94,"C4": 261.63,"C#4": 277.18,"D4": 293.66,"D#4": 311.13,"E4": 329.63,"F4": 349.23,"F#4": 369.99,"G4": 392,"G#4": 415.3,"A4": 440,"A#4": 466.16,"B4": 493.88,"C5": 523.25,"C#5": 554.37,"D5": 587.33,"D#5": 622.25,"E5": 659.26,"F5": 698.46,"F#5": 739.99,"G5": 783.99,"G#5": 830.61,"A5": 880,"A#5": 932.33,"B5": 987.77,"C6": 1046.5,"C#6": 1108.73,"D6": 1174.66,"D#6": 1244.51,"E6": 1318.51,"F6": 1396.91,"F#6": 1479.98,"G6": 1567.98,"G#6": 1661.22,"A6": 1760,"A#6": 1864.66,"B6": 1975.53,"C7": 2093,"C#7": 2217.46,"D7": 2349.32,"D#7": 2489.02,"E7": 2637.02,"F7": 2793.83,"F#7": 2959.96,"G7": 3135.96,"G#7": 3322.44,"A7": 3520,"A#7": 3729.31,"B7": 3951.07,"C8": 4186.01,"C#8": 4434.92,"D8": 4698.64,"D#8": 4978.03};

var getNotesForOctave = function(octave) {
  return Object.keys(NOTES).reduce((obj, note) => {
    if (note.split('').pop() == +octave)
      obj[note] = NOTES[note];
    return obj;
  }, {});
};

class Synth {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playNotes(notes = [], wave = 'sine') {
    var vco = this.ctx.createOscillator();
    vco.type = wave;
    vco.frequency.value = notes[0];

    /* VCA */
    var vca = this.ctx.createGain();
    vca.gain.value = 1;

    /* connections */
    vco.connect(vca);
    vca.connect(this.ctx.destination);

    vco.start(0);

    setTimeout(() => {
      vca.gain.setTargetAtTime(0, this.ctx.currentTime, 0.015);
    }, 50);
  }
}

var synth = new Synth();

class Sequencer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: 'sine',
      pads: [],
      bpm: 80,
      step: 0,
      steps: 8,
      playing: false,
      octave: 4
    };
  }

  componentWillMount() {

    var pads = [];

    for (let i = 0; i < this.state.steps; i++) {
      pads.push([1,0,0,0,0,0,0,0]);
    }

    this.setState({
      pads: pads,
      notes: getNotesForOctave(this.state.octave)
    });
  }

  changeWaveType(type) {
    this.setState({
      type: type
    }, () => {
      this.pause();

      if (this.state.playing) this.play();
    });
  }

  changeOctave(octave) {
    this.setState({
      octave: +octave,
      notes: getNotesForOctave(+octave)
    }, () => {
      this.pause();

      if (this.state.playing) this.play();
    });
  }

  play() {

    const { bpm, notes, type } = this.state;
    const notesArray = Object.keys(notes).map(key => notes[key]);

    this.setState({
      playing: true
    });

    this.interval = setInterval(() => {

      this.setState({
        step: this.state.step < this.state.steps - 1 ?
          this.state.step + 1 : 0
      }, () => {

        var next = this.state.pads[this.state.step].map((pad, i) =>
          pad === 1 ? notesArray[i] : null
        ).filter(x => x);

        synth.playNotes(next, type.toLowerCase());

      });

    }, 200);
  }

  pause() {
    this.setState({
      playing: false,
      step: 0
    });

    clearInterval(this.interval);
  }

  togglePad(group, pad) {

    var clonedPads = this.state.pads.slice(0);

    var padState = clonedPads[group][pad];

    clonedPads[group][pad] = padState === 1 ? 0 : 1;

    this.setState({
      pads: clonedPads
    });
  }

  render() {

    const { pads, step, notes } = this.state;

    const notesArray = Object.keys(notes).map(key => notes[key]);

    return (
      <div class="container">

        <header>
          <h1>React Sequencer</h1>
        </header>

        <div class="Sequencer">

          <div class="buttons">
            <button
              class={this.state.playing ? 'active' : ''}
              onClick={() => {
                if (this.state.playing) this.pause();
                else this.play();
              }}>
              Play
            </button>

            <div class="select-wrapper">
              <span>Wave</span>
              <select
                value={this.state.type}
                onChange={(e) => this.changeWaveType(e.target.value)}
                data-label="wave"
                data-label="wave"
                class="wave">
                <option>Sine</option>
                <option>Square</option>
                <option>Triangle</option>
              </select>
            </div>

            <div class="select-wrapper">
              <span>Octave</span>
              <select
                value={this.state.octave}
                onChange={(e) => this.changeOctave(e.target.value)}
                data-label="octave"
                class="octave">
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
            </div>
          </div>

          <ul class="notes">
            {Object.keys(notes).slice(0, 8).reverse().map(note =>
              <li>{note.slice(0, note.length - 1)}</li>
            )}
          </ul>

          <div class="flex">
          {pads.map((group, groupIndex) =>
            <div class="pads">
              {group.map((pad, i) =>
                <div
                  data-note={notesArray[i]}
                  note={notesArray[i]}
                  onClick={() => {
                    this.togglePad(groupIndex, i);
                  }}
                  class={classNames('pad', {
                    active: groupIndex === step,
                    on: pad === 1
                  })}
                />
              )}
            </div>
          )}
          </div>
        </div>

        <footer>
          Made by <a target="_blank" href="https://markmurray.co">Mark Murray</a>. View the source on <a href="https://github.com/markmur/react-sequencer">Github</a>.
        </footer>
      </div>
    )
  }
}

export default Sequencer;
