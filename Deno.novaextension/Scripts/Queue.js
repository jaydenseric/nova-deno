/**
 * A task queue runner that runs added tasks after all previously added tasks
 * have settled.
 */
class Queue {
  constructor() {
    this.queue = new Set();
  }

  /**
   * Adds a task to the queue.
   * @param {function} task Task, that may return a promise.
   * @returns {Promise} Resolves what the task returns.
   */
  // deno-lint-ignore require-await
  async add(task) {
    if (typeof task !== "function") {
      throw new TypeError("Argument 1 `task` must be a function.");
    }

    const promise = Promise.allSettled(this.queue).then(task).finally(() => {
      // Remove the settled queue item to allow garbage collection and prevent
      // the queue from growing infinitely long.
      this.queue.delete(promise);
    });

    this.queue.add(promise);

    return promise;
  }
}

module.exports = Queue;
