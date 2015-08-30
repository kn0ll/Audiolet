import { AudioletNode } from '../core/AudioletNode';

/**
 * Detect discontinuities in the input stream.  Looks for consecutive samples
 * with a difference larger than a threshold value.
 *
 * **Inputs**
 *
 * - Audio
 *
 * **Outputs**
 *
 * - Audio
 */
class DiscontinuityDetector extends AudioletNode {

  /*
   * @constructor
   * @extends PassThroughNode
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} [threshold=0.2] The threshold value.
   * @param {Function} [callback] Function called if a discontinuity is detected.
   */
  constructor(audiolet, threshold, callback) {
    super(audiolet, 1, 1);
    this.linkNumberOfOutputChannels(0, 0);

    this.threshold = threshold || 0.2;
    if (callback) {
      this.callback = callback;
    }
    this.lastValues = [];
  }

  /**
   * Default callback.  Logs the size and position of the discontinuity.
   *
   * @param {Number} size The size of the discontinuity.
   * @param {Number} channel The index of the channel the samples were found in.
   * @param {Number} index The sample index the discontinuity was found at.
   */
  callback(size, channel) {
    console.error('Discontinuity of ' + size + ' detected on channel ' +
                  channel);
  }

  /**
   * Process samples
   */
  generate() {
    var input = this.inputs[0];
    var output = this.outputs[0];

    var numberOfChannels = input.samples.length;
    for (var i = 0; i < numberOfChannels; i++) {
      if (i >= this.lastValues.length) {
        this.lastValues.push(0);
      }

      var value = input.samples[i];
      var diff = Math.abs(this.lastValues[i] - value);
      if (diff > this.threshold) {
        this.callback(diff, i);
      }

      this.lastValues[i] = value;
    }
  }

  /**
   * toString
   *
   * @return {String} String representation.
   */
  toString() {
    return 'Discontinuity Detector';
  }

}

export default { DiscontinuityDetector };
