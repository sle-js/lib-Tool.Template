module.exports = $importAll([
    "core:Native.Data.Array:1.2.0",
    "use:./Errors.estree core:Tool.ESTree:1.0.3",
    "core:Native.System.IO.FileSystem:1.1.0",
    "path",
    "core:Native.Data.String:1.0.0"
]).then($imports => ({
    Array: $imports[0],
    Errors: $imports[1],
    FileSystem: $imports[2],
    Path: $imports[3],
    String: $imports[4],
}));