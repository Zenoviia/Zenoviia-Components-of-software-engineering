// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilter = (array, asyncFunction) => {

};

const customFilter = (item) => {
    return item;
}

const array = Array.from({length: 100}, (_, index) => index);

asyncFilter(array, async (item, signal) => {
    if (signal.aborted) {
        throw new Error(`Aborted before processing element "${item}"!`);
    } else return customFilter(item);
})