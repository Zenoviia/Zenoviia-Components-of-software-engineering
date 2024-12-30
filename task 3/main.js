// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilter = async (array, asyncFunction) => {
    const results = [];
    const controller = new AbortController();
    const {signal} = controller;
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 500);

    for (const element of array) {
        if (signal.aborted) {
            throw new Error(`Aborted before processing element "${element}"!`);
        }
        const filterArray = await asyncFunction(element, signal);
        results.push(filterArray);
        await new Promise((resolve) => setTimeout(resolve, 30));
    }
    return {results};
}

const customFilter = (item) => {
    if (item > 10) {
        return "Too big number"
    }
    return item
}

const array = Array.from({length: 100}, (_, index) => index);

asyncFilter(array, async (item, signal) => {
    if (signal.aborted) {
        throw new Error(`Aborted before processing element "${item}"!`);
    } else return customFilter(item);
}).then((res) => console.log(res))
    .catch((err) => console.log(err))