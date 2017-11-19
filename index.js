module.exports = $importAll([
    "core:Native.Data.Array:1.2.0",
    "./src/Errors",
    "core:Native.System.IO.FileSystem:1.1.0",
    "core:Native.Data.String:1.0.0"
]).then($imports => {
    const Array = $imports[0];
    const Errors = $imports[1];
    const FileSystem = $imports[2];
    const String = $imports[3];


    const parse = content => {
        const indexOfNewline =
            String.indexOf("\n")(content).withDefault(-1);

        const hasParameters =
            String.startsWith("%%%")(content) && indexOfNewline > 0;

        const variables =
            hasParameters
                ? Array.map(String.trim)(String.split(",")(String.substring(3)(indexOfNewline)(content)))
                : [];

        const template =
            String.drop(indexOfNewline + 1)(content);

        return {variables, template};
    };
    assumptionEqual(parse("%%% a, b\nHello World"), {variables: ["a", "b"], template: "Hello World"});
    assumptionEqual(parse("Hello World"), {variables: [], template: "Hello World"});


    const readFile = templateFileName =>
        FileSystem
            .readFile(templateFileName)
            .catch(err => Promise.reject(Errors.TemplateFileDoesNotExist(templateFileName)));


    const translate = templateFileName => {
        const validate = content =>
            Array.length(content.variables) === 0
                ? Promise.reject(Errors.NoParameters(templateFileName))
                : Promise.resolve(content);

        return readFile(templateFileName)
            .then(parse)
            .then(validate);
    };


    return {
        translate
    }
});
