module.exports = $importAll([
    "core:Test.Unit.Assertion:2.0.1",
    "./../src/Errors",
    "path",
    "../index.js",
    "core:Test.Unit:1.0.0"
]).then($imports => {
    const Assertion = $imports[0];
    const Errors = $imports[1];
    const Path = $imports[2];
    const Use = $imports[3];
    const Unit = $imports[4];


    const toString = o =>
        JSON.stringify(o, null, 2);


    const path = relativeName =>
        Path.resolve(Path.dirname(__filename), relativeName);


    const thenTest = name => promise => thenAssertion =>
        promise
            .then(okay => Unit.Test(name)(thenAssertion(okay)))
            .catch(err => Unit.Test(name)(Assertion.fail("Error handler raised: " + toString(err))));


    return Unit.Suite("Use Test")([

        thenTest("Template file does not exists")(
            Use.translate(path("./unknown_file.template")))(
            okay => Assertion.equals(toString(okay))(toString(Errors.TemplateFileDoesNotExist(path("./unknown_file.template"))))),

        // thenTest("Template with input of Bob and Mary will return the expected output")(
        //     Use.translate(path("./001.template"))
        //         .then(template => Promise.all([
        //             template("Bob")("Mary"),
        //             FileSystem.readFile(path("./001.output"))
        //         ])))(
        //     okay => Assertion.equals(okay[0])(okay[1]))
    ])
});