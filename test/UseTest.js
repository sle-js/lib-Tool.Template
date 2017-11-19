module.exports = $importAll([
    "core:Test.Unit.Assertion:2.0.1",
    "./../src/Errors",
    "core:Native.System.IO.FileSystem:1.0.0",
    "path",
    "../index.js",
    "core:Test.Unit:1.0.0"
]).then($imports => {
    const Assertion = $imports[0];
    const Errors = $imports[1];
    const FileSystem = $imports[2];
    const Path = $imports[3];
    const Use = $imports[4];
    const Unit = $imports[5];


    const toString = o =>
        JSON.stringify(o, null, 2);


    const path = relativeName =>
        Path.resolve(Path.dirname(__filename), relativeName);


    const thenTest = name => promise => thenAssertion =>
        promise
            .then(okay => Unit.Test(name)(thenAssertion(okay)))
            .catch(err => {
                console.error(err);
                return Unit.Test(name)(Assertion.fail("Error handler raised: " + toString(err)))
            });


    const catchTest = name => promise => errorAssertion =>
        promise
            .then(_ => Unit.Test(name)(Assertion.fail("Expected error but returned a success: " + toString(_))))
            .catch(err => Unit.Test(name)(errorAssertion(err)))
            .catch(err => Unit.Test(name)(Assertion.fail("Error handler raised: " + toString(err))));

    return Unit.Suite("Use Test")([

        catchTest("Template file does not exists")(
            Use.translate(path("./unknown_file.template")))(
            err => Assertion.equals(toString(err))(toString(Errors.TemplateFileDoesNotExist(path("./unknown_file.template"))))),

        catchTest("Template file has no parameters")(
            Use.translate(path("./no-parameters.template")))(
            err => Assertion.equals(toString(err))(toString(Errors.NoParameters(path("./no-parameters.template"))))),

        thenTest("Template with input of Bob and Mary will return the expected output")(
            $useOn("file:" + path("../index"))(path("./001.template"))
                .then(template => Promise.all([
                    template("Bob")("Mary"),
                    FileSystem.readFile(path("./001.output"))
                ])))(
            okay => Assertion.equals(okay[0])(okay[1]))

        // thenTest("Template with input of Bob and Mary will return the expected output")(
        //     Use.translate(path("./001.template"))
        //         .then(template => Promise.all([
        //             template("Bob")("Mary"),
        //             FileSystem.readFile(path("./001.output"))
        //         ])))(
        //     okay => Assertion.equals(okay[0])(okay[1]))
    ])
});