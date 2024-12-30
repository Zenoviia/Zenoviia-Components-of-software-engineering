// // // Task 3
// // //   * Integrate AbortController or other Cancallable approach

"use strict";

const asyncFilter = async (array, asyncFunction) => {
    const results = [];
    const controller = new AbortController();
    const {signal} = controller;

    setTimeout(() => {
        controller.abort();
    }, 500);

    for (const element of array) {
        if (signal.aborted) {
            throw new Error(`Aborted before processing element "${element}"!`);
        }
        console.log("Generated element:", element);
        if (await asyncFunction(element, signal)) {
            results.push(element);
        }

        await new Promise((resolve) => setTimeout(resolve, 30));
    }
    return {results};
};

const customFilter = (item) => {
    return item % 10 === 0;
};

const array = Array.from({length: 100}, (_, index) => index);

asyncFilter(array, async (item, signal) => {
    if (signal.aborted) {
        throw new Error(`Aborted before processing element "${item}"!`);
    } else return customFilter(item);
})
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
