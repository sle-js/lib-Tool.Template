module.exports = $importAll([
    "./src/Errors",
    "core:Native.System.IO.FileSystem:1.1.0"
]).then($imports => {
    const Errors = $imports[0];
    const FileSystem = $imports[1];


    const translate = file =>
        FileSystem
            .readFile(file)
            .catch(err => Errors.TemplateFileDoesNotExist(file));

    return {
        translate
    }
});
