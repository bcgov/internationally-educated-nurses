const Sequencer = require('@jest/test-sequencer').default;

// references
// https://jestjs.io/docs/configuration#testsequencer-string:~:text=runner%20package.-,testSequencer,-%5Bstring%5D
class CustomSequencer extends Sequencer {
  shard(tests, { shardIndex, shardCount }) {
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return [...tests].sort((a, b) => (a.path > b.path ? 1 : -1)).slice(shardStart, shardEnd);
  }

  /**
   * Sort test to determine order of execution
   * Sorting is applied after sharding
   */
  sort(tests) {
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  }
}

module.exports = CustomSequencer;
