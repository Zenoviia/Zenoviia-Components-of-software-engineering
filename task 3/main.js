// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilterPromise = (array, asyncFunction) => {
  const promises = array.map((item, index) => asyncFunction(item, index));

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

const checkAccess = (user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      user.hasAccess
        ? resolve(user)
        : reject(`User ${user.name} (ID: ${user.id}) does not have access`);
    }, 1000);
  });
};

const users = [
  { id: 1, name: "Alice", hasAccess: true },
  { id: 2, name: "Bob", hasAccess: false },
  { id: 3, name: "Charlie", hasAccess: true },
];

asyncFilterPromise(users, checkAccess)
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