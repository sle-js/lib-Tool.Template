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
        Path.join(Path.dirname(__filename), relativeName);


    const thenTest = name => promise => thenAssertion =>
        promise
            .then(okay => Unit.Test(name)(thenAssertion(okay)))
            .catch(err => Unit.Test(name)(Assertion.fail("Error handler raised: " + err)));


    return thenTest("Template file does not exists")(
        Use.translate(path("./unknown_file.template")))(
        okay => Assertion.equals(toString(okay))(toString(Errors.TemplateFileDoesNotExist(path("./unknown_file.template")))))
}).catch(console.error);