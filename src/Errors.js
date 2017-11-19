// data Errors =
//      TemplateFileDoesNotExist { package :: String, name :: String }
//    | NoParameters { package :: String, name :: String }


const TemplateFileDoesNotExist = name =>
    ({package: "Text.Template", kind: "TemplateFileDoesNotExist", name});


const NoParameters = name =>
    ({package: "Text.Template", kind: "NoParameters", name});


module.exports = Promise.resolve({
    NoParameters,
    TemplateFileDoesNotExist
});