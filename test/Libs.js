module.exports = $importAll([
    "./../src/Libs",
    "core:Test.Unit.Assertion:2.0.1",
    "../index.js",
    "core:Test.Unit:1.0.0"

]).then($imports =>Object.assign({}, $imports[0], {
    Assertion: $imports[1],
    Index: $imports[2],
    Unit: $imports[3]
}));