let counter = 1;
function test(lhs, rhs=true) {
    if (lhs !== rhs) {
        console.group();
        console.log(`#${counter} error`);
        console.log("\t", lhs);
        console.log("\t", rhs);
        console.groupEnd();
    }
    counter++;
}

module.exports = {
    test,
};