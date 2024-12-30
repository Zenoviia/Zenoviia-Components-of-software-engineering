// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

import { users } from "./data.js";

const asyncFilterPromise = (array, callback, signal) => {
  const promises = array.map((item, index) => {
    if (signal?.aborted) {
      return Promise.reject(new Error("Operation aborted"));
    }

    return callback(item, index, signal);
  });

  return Promise.allSettled(promises).then((results) => {
    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const errors = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    if (errors.length > 0) {
      const aggregateError = new AggregateError(
        errors,
        "Some promises were rejected"
      );
      aggregateError.successfulResults = successfulResults;
      throw aggregateError;
    }

    return successfulResults;
  });
};

const checkAccess = (user, index, signal) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        reject(new Error("Operation aborted"));
        return;
      }

      if (user.hasAccess) {
        resolve(user);
      } else {
        reject(`User ${user.name} (ID: ${user.id}) does not have access`);
      }
    }, 100);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new Error("Operation aborted"));
    });
  });
};

const controller = new AbortController();
const { signal } = controller;

asyncFilterPromise(users, checkAccess, signal)
  .then((result) => {
    console.log("Users with access:", result);
  })
  .catch((error) => {
    if (error instanceof AggregateError) {
      console.error("Errors occurred:", error.errors); // Перелік помилок
      console.log("Users with access:", error.successfulResults); // Успішні результати
    } else {
      console.error("An unexpected error occurred:", error);
    }
  });

setTimeout(() => {
  controller.abort();
  console.log("Operation aborted");
}, 1000);
