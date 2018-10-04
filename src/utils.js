let _ = require('lodash')

function compileAndAddToZip(project, filePath, templateFn, exec, zip) {
    let compiled = templateFn(project);
    // add to zip
    if (exec) {
        zip.file(project.metadata.name + '/' + filePath, compiled, {
            unixPermissions: '755'
        });
    } else {
        zip.file(project.metadata.name + '/' + filePath, compiled);
    }

}

function writeFileAndDirMetadata(project, templatePath) {
    // extract filename
    var dot = templatePath.indexOf('.');
    var lslash = templatePath.lastIndexOf('/');
    project.metadata.dirName = _.get(project.metadata.packageDir || '')
    project.metadata.fileName = templatePath.substring(lslash + 1, dot);
}

function solveZipDir(project, templatePath) {
    // first path element is always ignored
    let zfile = templatePath.substr(templatePath.indexOf('/') + 1);

    // replace placeholders with variables if present
    zfile = zfile
        .replace(/{(.*?)}/g, function (match, varName) {
            return project.metadata[varName] || '';
        }).replace(/\/\//, '/');

    return zfile;
}

exports.compileAndAddToZip = compileAndAddToZip
exports.writeFileAndDirMetadata = writeFileAndDirMetadata
exports.solveZipDir = solveZipDir