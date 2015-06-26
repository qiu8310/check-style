/**
 * @file 添加 `jshint && jscs && ...` 到你的 pakcage.json 文件中
 *
 * @author Mora <qiuzhonglei@hujiang.com>
 *
 */

var path = require('path'),
    fs = require('fs'),
    cp = require('child_process');


var pkgFile = up(),
    pkgRoot,
    pkg,
    isUpdatedDevDependencies,
    isUpdatedTestScripts,
    hasJsFilesInPkgRoot = true,
    jsFileLabel;

if (!pkgFile) throw new Error('Can\'t found package.json file!');

pkgRoot = path.dirname(pkgFile);
pkg = require(pkgFile);

jsFileLabel = _detectJsFiles().join(' ');
if (!jsFileLabel) {
    hasJsFilesInPkgRoot = false;
    jsFileLabel = '*.js */*.js';
}

_copyRcFiles();
_addScripts();
_addDevDependencies();

if (isUpdatedTestScripts || isUpdatedDevDependencies)
    fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, detectIndent(pkgFile)));


if (isUpdatedDevDependencies) {
    var ps = cp.spawn('npm', ['install'], {stdio: 'inherit'});
    ps.on('close', function (code) {
        if (!code) runTest();
    });
} else {
    runTest();
}



function runTest() {
    if (hasJsFilesInPkgRoot)
        cp.spawn('npm', ['test'], {stdio: 'inherit'});
    else
        console.log('Not found any js files.');
}

function _detectJsFiles() {

    var result = [];

    if (hasJsFileInDirectory(pkgRoot)) {
        result.push('*.js');
    }

    var hasJsInSubDirectory = fs.readdirSync(pkgRoot).some(function (file) {
        file = path.join(pkgRoot, file);
        return fs.statSync(file).isDirectory() && hasJsFileInDirectory(file);
    });

    if (hasJsInSubDirectory) {
        result.push('*/*.js');
    }

    return result;
}

function _copyRcFiles() {
    ['.jshintrc', '.jscsrc'].forEach(function (file) {
        var dist = path.join(pkgRoot, file);
        var src = path.join(__dirname, '..', file);

        if (!fs.existsSync(dist)) {
            fs.writeFileSync(dist, fs.readFileSync(src));
        }
    });
}

function _addScripts() {
    pkg.scripts = pkg.scripts || {};

    var testScript = pkg.scripts.test || '';
    var checkStyleScripts = [];

    if (testScript.indexOf('jshint') < 0) {
        isUpdatedTestScripts = true;
        checkStyleScripts.push('jshint ' + jsFileLabel);
    }

    if (testScript.indexOf('jscs') < 0) {
        isUpdatedTestScripts = true;
        checkStyleScripts.push('jscs ' + jsFileLabel);
    }

    if (testScript) {
        checkStyleScripts.push(testScript);
    }

    pkg.scripts.test = checkStyleScripts.join(' && ');
}

function _addDevDependencies() {
    var dep = pkg.devDependencies || {};
    var keys = Object.keys(dep);

    if (keys.indexOf('jshint') < 0) {
        isUpdatedDevDependencies = true;
        dep.jshint = '^2.8.0';
    }

    if (keys.indexOf('jscs') < 0) {
        isUpdatedDevDependencies = true;
        dep.jscs = '^1.13.0';
    }

    pkg.devDependencies = dep;
}


/**
 * 判断一个目录中是否有 JS 文件
 */
function hasJsFileInDirectory(dir) {
    return fs.readdirSync(dir).some(function (file) {
        if (file === 'node_modules' || file === 'bower_components')
            return false;
        return /\.js$/.test(file);
    });
}

/**
 * 判断一个文件的使用的 indent
 *
 * @param {String} filePath
 * @returns {String} 文件的 indent
 */
function detectIndent(filePath) {
    var content = fs.readFileSync(filePath).toString();
    var lines = content.split(/[\r]?\n/);
    var indent = '';

    for (var i = 0; i < lines.length && !indent; i++) {
        if (/(\t| {2,})/.test(lines[i])) {
            indent = RegExp.$1;
        }
    }
    return indent || '    ';
}

/**
 * 逐层向上查找 package.json 文件
 * @param {String} [dir] - 查找的初始目录，如果没设定，默认使用 当前目录
 * @returns {String|Boolean} 返回文件的路径，或者 false
 */
function up(dir) {
    dir = dir || process.cwd();

    if (dir === '/' || /^\w:[\\\/]$/.test(dir)) return false;

    var pkgFile = path.join(dir, 'package.json');

    if (fs.existsSync(pkgFile)) {
        return pkgFile;
    }

    return up(path.dirname(dir));
}
