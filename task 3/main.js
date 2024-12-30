// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilter = (array, asyncFunction) => {

};

const array = Array.from({ length: 100 }, (_, index) => index);

asyncFilter(array, checkAccess)
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
