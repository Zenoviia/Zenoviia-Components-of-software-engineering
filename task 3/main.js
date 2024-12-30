// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

import { users } from "./data.js";

// const users = require("./data.js")

const asyncFilterPromise = (array, asyncFunction, abortTime) => {
  const controller = new AbortController();
  const { signal } = controller;
  const promises = array.map((item, index) =>
    asyncFunction(item, index, signal)
  );

  // Таймер для виклику аборту після певного часу
  setTimeout(() => {
    controller.abort();
  }, abortTime);

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
  }).catch((error) => {
    if (error.name === 'AbortError') {
      throw new Error('Operation aborted due to timeout');
    }
    throw error; // Перехоплюємо інші помилки
  });
};

const checkAccess = (user, index, signal) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (signal.aborted) {
        reject(new Error(`Aborted processing user ${user.name}`));
      } else {
        user.hasAccess
          ? resolve(user)
          : reject(`User ${user.name} (ID: ${user.id}) does not have access`);
      }
    }, 100);

    // Перевірка на аборт до виконання
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error(`Aborted processing user ${user.name}`));
    });
  });
};

const asyncForEach = async (array, abortTime, fn) => {
  const controller = new AbortController();
  const { signal } = controller;

  // Таймер для аборту після певного часу
  setTimeout(() => {
    controller.abort();
  }, abortTime);

  for (const item of array) {
    if (signal.aborted) {
      throw new Error(`Operation aborted after ${abortTime}ms`);
    }
    try {
      const result = await fn(item, signal);
      if (result) {
        console.log(`User ${result.name} (ID: ${result.id}) has access`);
      } else {
        console.log("No result for user:", item.name);
      }
    } catch (err) {
      console.log(err.message); // Виводимо повідомлення про помилку
    }
    console.log(); // Перехід на новий рядок після кожної обробки елемента
  }
};

asyncForEach(
  users,
  1000, // Час на виконання кожної операції
  async (user, signal) => {
    if (signal.aborted) {
      throw new Error(`Aborted processing user ${user.name}`);
    } else {
      try {
        const result = await checkAccess(user, 0, signal);
        return result; // Повертаємо результат, щоб його можна було вивести
      } catch (err) {
        throw err; // Переводимо помилку далі для обробки
      }
    }
  }
)
  .then(() => {
    console.log("All operations completed.");
  })
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.error("Operation was aborted!");
    } else {
      console.error("An unexpected error occurred:", error);
    }
  });
