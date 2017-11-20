module.exports = $import(
    "./Libs"
).then($imports => {
    const Assertion = $imports.Assertion;
    const Errors = $imports.Errors;
    const FileSystem = $imports.FileSystem;
    const Path = $imports.Path;
    const Index = $imports.Index;
    const Unit = $imports.Unit;


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
            Index.translate(path("./unknown_file.template")))(
            err => Assertion.equals(toString(err))(toString(Errors.TemplateFileDoesNotExist(path("./unknown_file.template"))))),

        catchTest("Template file has no parameters")(
            Index.translate(path("./no-parameters.template")))(
            err => Assertion.equals(toString(err))(toString(Errors.NoParameters(path("./no-parameters.template"))))),

        thenTest("Template with input of Bob and Mary will return the expected output")(
            $useOn("file:" + path("../index"))(path("./001.template"))
                .then(template => Promise.all([
                    template("Bob")("Mary"),
                    FileSystem.readFile(path("./001.output"))
                ])))(
            okay => Assertion.equals(okay[0])(okay[1]))
    ])
});