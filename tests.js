module.exports = $import(
    "core:Test.Unit:1.0.0"
).then(Unit => {
    return Unit.Suite("Tool.Template")([
        $import("./test/UseTest")
    ])
        .then(Unit.showDetail)
        .then(Unit.showSummary)
        .then(Unit.setExitCodeOnFailures);
});


