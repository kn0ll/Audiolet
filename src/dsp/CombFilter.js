import { AudioletNode } from '../core/AudioletNode';
import { AudioletParameter } from '../core/AudioletParameter';

/**
 * Undamped comb filter
 *
 * **Inputs**
 *
 * - Audio
 * - Delay Time
 * - Decay Time
 *
 * **Outputs**
 *
 * - Filtered audio
 *
 * **Parameters**
 *
 * - delayTime The delay time in seconds.  Linked to input 1.
 * - decayTime Time for the echoes to decay by 60dB.  Linked to input 0.
 */
class CombFilter extends AudioletNode {

  /*
   * @constructor
   * @extends AudioletNode
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} maximumDelayTime The largest allowable delay time.
   * @param {Number} delayTime The initial delay time.
   * @param {Number} decayTime The initial decay time.
   */
  constructor(audiolet, maximumDelayTime, delayTime, decayTime) {
    super(audiolet, 3, 1);
    this.linkNumberOfOutputChannels(0, 0);
    this.maximumDelayTime = maximumDelayTime;
    this.delayTime = new AudioletParameter(this, 1, delayTime || 1);
    this.decayTime = new AudioletParameter(this, 2, decayTime);
    this.buffers = [];
    this.readWriteIndex = 0;
  }

  /**
   * Process samples
   */
  generate() {
    var input = this.inputs[0];
    var output = this.outputs[0];

    var sampleRate = this.audiolet.device.sampleRate;

    var delayTime = this.delayTime.getValue() * sampleRate;
    var decayTime = this.decayTime.getValue() * sampleRate;
    var feedback = Math.exp(-3 * delayTime / decayTime);

    var numberOfChannels = input.samples.length;
    for (var i = 0; i < numberOfChannels; i++) {
      if (i >= this.buffers.length) {
        // Create buffer for channel if it doesn't already exist
        var bufferSize = this.maximumDelayTime * sampleRate;
        this.buffers.push(new Float32Array(bufferSize));
      }

      var buffer = this.buffers[i];
      var outputValue = buffer[this.readWriteIndex];
      output.samples[i] = outputValue;
      buffer[this.readWriteIndex] = input.samples[i] + feedback * outputValue;
    }

    this.readWriteIndex += 1;
    if (this.readWriteIndex >= delayTime) {
      this.readWriteIndex = 0;
    }
  }

  /**
   * toString
   *
   * @return {String} String representation.
   */
  toString() {
    return 'Comb Filter';
  }


}

export default { CombFilter };
