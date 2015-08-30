import { AudioletNode } from '../core/AudioletNode';
import { AudioletParameter } from '../core/AudioletParameter';

/**
 * Pulse wave oscillator.
 *
 * **Inputs**
 *
 * - Frequency
 * - Pulse width
 *
 * **Outputs**
 *
 * - Waveform
 *
 * **Parameters**
 *
 * - frequency The oscillator frequency.  Linked to input 0.
 * - pulseWidth The pulse width.  Linked to input 1.
 */
class Pulse extends AudioletNode {

  /*
   * @constructor
   * @extends AudioletNode
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} [frequency=440] The initial frequency.
   * @param {Number} [pulseWidth=0.5] The initial pulse width.
   */
  constructor(audiolet, frequency, pulseWidth) {
    super(audiolet, 2, 1);
    this.frequency = new AudioletParameter(this, 0, frequency || 440);
    this.pulseWidth = new AudioletParameter(this, 1, pulseWidth || 0.5);
    this.phase = 0;
  }

  /**
   * Process samples
   */
  generate() {
    var pulseWidth = this.pulseWidth.getValue();
    this.outputs[0].samples[0] = (this.phase < pulseWidth) ? 1 : -1;

    var frequency = this.frequency.getValue();
    var sampleRate = this.audiolet.device.sampleRate;
    this.phase += frequency / sampleRate;
    if (this.phase > 1) {
      this.phase %= 1;
    }
  }

  /**
   * toString
   *
   * @return {String} String representation.
   */
  toString() {
    return 'Pulse';
  }

}

export default { Pulse };
