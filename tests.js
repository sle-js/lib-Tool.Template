module.exports = $import(
    "./test/Libs"
).then($imports => {
    const Unit = $imports.Unit;

    return Unit.Suite("Tool.Template")([
        $import("./test/UseTest")
    ])
        .then(Unit.showDetail)
        .then(Unit.showSummary)
        .then(Unit.setExitCodeOnFailures);
}).catch(err => {
    console.error(err);
    process.exitCode = -1;
    return err;
});
