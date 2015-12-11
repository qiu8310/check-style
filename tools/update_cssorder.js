var fs = require('fs-extra');
var path = require('path');

var join = path.join.bind(path, path.dirname(__dirname));

var cssorderFile = join('cssorder'),
  csscombFile = join('csscomb.json'),
  sasslintFile = join('.sass-lint.yml');

var shouldUpdateCsscombFile = false;
var shouldUpdateSassLintFile = false;


// source
var cssorder = fs.readFileSync(cssorderFile).toString().split('\n').filter(function (l) {
  return l.trim() && l.trim()[0] !== '#';
});


// update csscomb.json
var csscomb = require(csscombFile);

if (JSON.stringify(cssorder) !== JSON.stringify(csscomb['sort-order'])) {
  shouldUpdateCsscombFile = true;
  csscomb['sort-order'] = cssorder;
  fs.writeFileSync(csscombFile, JSON.stringify(csscomb, null, 2));
  console.log('更新 ' + csscombFile + ' 成功');
}



// update .sass-lint.yml
var sasslint = fs.readFileSync(sasslintFile).toString();

sasslint = sasslint.replace(/( {6}order:\n)([\s\S]*?)(\n  quotes:)/, function (raw, prefix, matched, suffix) {
  var newSource = cssorder.map(function (i) { return '        - \'' + i + '\''; }).join('\n');

  if (newSource !== matched) {
    shouldUpdateSassLintFile = true;
    return prefix + newSource + suffix;
  }
  return raw;
});

if (shouldUpdateSassLintFile) {
  fs.writeFileSync(sasslintFile, sasslint);
  console.log('更新 ' + sasslintFile + ' 成功');
}


if (!shouldUpdateCsscombFile && !shouldUpdateSassLintFile) {
  console.log('没有文件需要更新');
}




