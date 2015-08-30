import { AudioletNode } from '../core/AudioletNode';
import { AudioletParameter } from '../core/AudioletParameter';

/**
 * Sine wave oscillator
 *
 * **Inputs**
 *
 * - Frequency
 *
 * **Outputs**
 *
 * - Sine wave
 *
 * **Parameters**
 *
 * - frequency The frequency of the oscillator.  Linked to input 0.
 */
class Sine extends AudioletNode {

  /*
   * @constructor
   * @extends AudioletNode
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} [frequency=440] Initial frequency.
   */
  constructor(audiolet, frequency) {
    super(audiolet, 1, 1);
    this.frequency = new AudioletParameter(this, 0, frequency || 440);
    this.phase = 0;
  }

  /**
   * Process samples
   */
  generate() {
    var output = this.outputs[0];

    var frequency = this.frequency.getValue();
    var sampleRate = this.audiolet.device.sampleRate;

    output.samples[0] = Math.sin(this.phase);

    this.phase += 2 * Math.PI * frequency / sampleRate;
    if (this.phase > 2 * Math.PI) {
      this.phase %= 2 * Math.PI;
    }
  }

  /**
   * toString
   *
   * @return {String} String representation.
   */
  toString() {
    return 'Sine';
  }

}

export default { Sine };
