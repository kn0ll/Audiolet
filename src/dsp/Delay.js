import { AudioletNode } from '../core/AudioletNode';
import { AudioletParameter } from '../core/AudioletParameter';

class Delay extends AudioletNode {

  /**
   * A simple delay line.
   *
   * **Inputs**
   *
   * - Audio
   * - Delay Time
   *
   * **Outputs**
   *
   * - Delayed audio
   *
   * **Parameters**
   *
   * - delayTime The delay time in seconds.  Linked to input 1.
   */
  /*
   * @constructor
   * @extends AudioletNode
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} maximumDelayTime The largest allowable delay time.
   * @param {Number} delayTime The initial delay time.
   */
  constructor(audiolet, maximumDelayTime, delayTime) {
    super(audiolet, 2, 1);
    this.linkNumberOfOutputChannels(0, 0);
    this.maximumDelayTime = maximumDelayTime;
    this.delayTime = new AudioletParameter(this, 1, delayTime || 1);
    var bufferSize = maximumDelayTime * this.audiolet.device.sampleRate;
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

    var numberOfChannels = input.samples.length;

    for (var i = 0; i < numberOfChannels; i++) {
      if (i >= this.buffers.length) {
        var bufferSize = this.maximumDelayTime * sampleRate;
        this.buffers.push(new Float32Array(bufferSize));
      }

      var buffer = this.buffers[i];
      output.samples[i] = buffer[this.readWriteIndex];
      buffer[this.readWriteIndex] = input.samples[i];
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
    return 'Delay';
  }

}

export default { Delay };
