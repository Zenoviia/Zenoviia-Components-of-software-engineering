// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilter = async (array, asyncFunction) => {
    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
        controller.abort()
    }, 100)
    for (const element of array) {
        if (signal.aborted) {
            throw new Error(`Aborted before processing element "${element}"!`)
        }
        const filterArray = await asyncFunction(element, signal)
    }
}

const customFilter = (item) => {
    return item;
}

const array = Array.from({length: 100}, (_, index) => index);

asyncFilter(array, async (item, signal) => {
    if (signal.aborted) {
        throw new Error(`Aborted before processing element "${item}"!`);
    } else return customFilter(item);
})