module.exports = $importAll([
    "core:Native.Data.Array:1.2.0",
    "use:./src/Errors.estree core:Tool.ESTree:1.0.0",
    "core:Native.System.IO.FileSystem:1.1.0",
    "path",
    "core:Native.Data.String:1.0.0"
]).then($imports => {
    const Array = $imports[0];
    const Errors = $imports[1];
    const FileSystem = $imports[2];
    const Path = $imports[3];
    const String = $imports[4];


    const replaceExtension = newExtension => fileName => {
        const parseFileName =
            Path.parse(fileName);

        return Path.join(parseFileName.dir, parseFileName.name + newExtension);
    };
    assumptionEqual(replaceExtension(".js")("/home/bob/test.sample"), "/home/bob/test.js");
    assumptionEqual(replaceExtension(".js")("./test.sample"), "test.js");


    const target = fileName =>
        replaceExtension(".js")(fileName);


    const parse = content => {
        const indexOfNewline =
            String.indexOf("\n")(content).withDefault(-1);

        const hasParameters =
            String.startsWith("%%%")(content) && indexOfNewline > 0;

        const variables =
            hasParameters
                ? Array.map(String.trim)(String.split(" ")(String.trim(String.substring(3)(indexOfNewline)(content))))
                : [];

        const template =
            String.drop(indexOfNewline + 1)(content);

        return {variables, template};
    };
    assumptionEqual(parse("%%% a b\nHello World"), {variables: ["a", "b"], template: "Hello World"});
    assumptionEqual(parse("Hello World"), {variables: [], template: "Hello World"});


    const templateRE =
        /<%(.+?)%>/g;


    const toJavaScript = template => {
        const formatExpression = text =>
            '    r.push(' + text.trim() + ');\n';

        const formatLiteral = text =>
            (text === '')
                ? ""
                : '    r.push("' + text.replace(/"/g, '\\"') + '");\n';

        let code = '    const r=[];\n';
        template.split('\n').forEach((line, index) => {
            if (line.startsWith(">")) {
                code += line.substr(1) + '\n'
            } else {
                let cursor = 0;
                if (line.startsWith("+")) {
                    cursor = 1;
                } else if (index > 0) {
                    code += '    r.push("\\n");\n';
                }
                templateRE.lastIndex = 0;
                let match;
                while (match = templateRE.exec(line)) {
                    code += formatLiteral(line.slice(cursor, match.index));
                    code += formatExpression(match[1]);
                    cursor = match.index + match[0].length;
                }
                code += formatLiteral(line.substr(cursor, line.length - cursor));
            }
        });
        code += '    return r.join("");';

        return code;
    };


    const readFile = templateFileName =>
        FileSystem
            .readFile(templateFileName)
            .catch(err => Promise.reject(Errors.TemplateFileDoesNotExist(templateFileName)));


    const translate = templateFileName => {
        const validate = content =>
            Array.length(content.variables) === 0
                ? Promise.reject(Errors.NoParameters(templateFileName))
                : Promise.resolve(content);

        const targetFileName =
            target(templateFileName);

        return readFile(templateFileName)
            .then(parse)
            .then(validate).then(_ => ({variables: _.variables, template: toJavaScript(_.template)}))
            .then(_ => "const process = " + _.variables.map(i => i + " => ").join("") + "{\n" + _.template + "\n" + "};\n\n\nmodule.exports = Promise.resolve(process);\n")
            .then(content => FileSystem.writeFile(targetFileName)(content));
    };


    return {
        target,
        translate
    }
});
