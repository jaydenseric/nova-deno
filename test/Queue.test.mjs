// @ts-check
/// <reference lib="deno.window" />

import {
  assert,
  assertRejects,
  assertStrictEquals,
} from "std/testing/asserts.ts";
import { createRequire } from "std/node/module.ts";

const require = createRequire(import.meta.url);

/** @type {typeof import("../Deno.novaextension/Scripts/Defer.js")} */
const Defer = require("../Deno.novaextension/Scripts/Defer.js");

/** @type {typeof import("../Deno.novaextension/Scripts/Queue.js")} */
const Queue = require("../Deno.novaextension/Scripts/Queue.js");

Deno.test(
  "`Queue` constructor.",
  () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue instanceof Set, true);
    assertStrictEquals(queue.queue.size, 0);
    assertStrictEquals(typeof queue.add, "function");
  },
);

Deno.test(
  "`Queue` method `add`, argument 1 `task` not a function.",
  async () => {
    const queue = new Queue();

    await assertRejects(
      () =>
        queue.add(
          // @ts-expect-error Testing invalid.
          true,
        ),
      TypeError,
      "Argument 1 `task` must be a function.",
    );
  },
);

Deno.test(
  "`Queue` with a sync task, no exception.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    const result = await queue.add(() => "result a");

    assertStrictEquals(result, "result a");
    assertStrictEquals(queue.queue.size, 0);
  },
);

Deno.test(
  "`Queue` with a sync task, exception.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    const errorMessage = "Task error.";

    await assertRejects(
      () =>
        queue.add(() => {
          throw new Error(errorMessage);
        }),
      Error,
      errorMessage,
    );

    assertStrictEquals(queue.queue.size, 0);
  },
);

Deno.test(
  "`Queue` with an async task, no rejection.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    const result = await queue.add(
      // deno-lint-ignore require-await
      async () => "result a",
    );

    assertStrictEquals(result, "result a");
    assertStrictEquals(queue.queue.size, 0);
  },
);

Deno.test(
  "`Queue` with a async task, rejection.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    const errorMessage = "Task error.";

    await assertRejects(
      () =>
        queue.add(
          // deno-lint-ignore require-await
          async () => {
            throw new Error(errorMessage);
          },
        ),
      Error,
      errorMessage,
    );

    assertStrictEquals(queue.queue.size, 0);
  },
);

Deno.test(
  "`Queue` runs tasks in order.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    /** @type {boolean} */
    let taskAEnded;

    // Delay task A ending until after task B is queued.
    const { promise: taskADelay, resolve: resolveTaskADelay } = new Defer();

    const resultAPromise = queue.add(async () => {
      await taskADelay;
      taskAEnded = true;
      return "result a";
    });

    const resultBPromise = queue.add(() => {
      assert(taskAEnded, "Task B started before task A ended.");
      return "result b";
    });

    resolveTaskADelay();

    const resultA = await resultAPromise;

    assertStrictEquals(resultA, "result a");
    assertStrictEquals(queue.queue.size, 1);

    const resultB = await resultBPromise;

    assertStrictEquals(resultB, "result b");
    assertStrictEquals(queue.queue.size, 0);
  },
);

Deno.test(
  "`Queue` runs tasks following a task that fails.",
  async () => {
    const queue = new Queue();

    assertStrictEquals(queue.queue.size, 0);

    // Delay task A failing until after task B is queued.
    const { promise: taskADelay, resolve: resolveTaskADelay } = new Defer();

    const errorMessage = "Task error.";
    const resultAPromise = queue.add(async () => {
      await taskADelay;
      throw new Error(errorMessage);
    });

    const resultBPromise = queue.add(() => "result b");

    resolveTaskADelay();

    await assertRejects(() => resultAPromise, Error, errorMessage);

    assertStrictEquals(await resultBPromise, "result b");
    assertStrictEquals(queue.queue.size, 0);
  },
);
