/**
 * @file JavaScript 编码规范主文件
 * @author Mora <qiuzhonglei@hujiang.com>
 */

var fs = require('fs-extra'),
    path = require('path'),
    async = require('async'),
    glob = require('glob');

var h = require('./lib/helper.js');
var CONFIG, CS_ROOT = __dirname, PKG_ROOT, DEBUG = false;

function glueGlobPatterns(patterns) {
  if (patterns.length === 1) {
    patterns = patterns[0];
  } else if (patterns.length > 1) {
    patterns = '{' + patterns.join(',') + '}';
  }
  return patterns;
}

function init(opts) {
  var pkgFile = h.up('package.json');
  PKG_ROOT = pkgFile ? path.dirname(pkgFile) : process.cwd();
  DEBUG = !!opts.debug;

  // 将后缀名组装成 glob 可以直接使用的字段串
  if (!opts.ext || opts.ext.length === 0) opts.ext = '*';
  else opts.ext = glueGlobPatterns(opts.ext.map(function (ext) { return ext.replace(/^\./, ''); }));

  // 没有指定使用任何的分析引擎，则自动根据文件后缀名来判断使用什么来 lint
  if (Object.keys(CONFIG).every(function (k) { return !opts[k]; })) opts.auto = true;

  Object.keys(CONFIG).forEach(function (key) {
    var configKey = key + 'Config', name = CONFIG[key].config;
    opts[configKey] = h.file(PKG_ROOT, name) || path.join(CS_ROOT, name);
  });
}

function log() { if (DEBUG) console.log.apply(console, arguments); }

function copy(src, dist) {
  console.log('Copy ' + src + ' => ' + dist);
  h.copy(src, dist);
}

function write(opts) {
  init(opts);
  Object.keys(CONFIG).forEach(function (k) {
    if (opts[k]) {
      var src = path.resolve(opts[k + 'Config']),
        dist = path.resolve(path.join(PKG_ROOT, '.' + k + 'rc'));
      if (fs.existsSync(dist)) console.error('目标文件已经存在（' + dist + '）');
      else if (src === dist) console.error('目标文件和源文件地址一样（' + src + '）');
      else copy(src, dist);
    }
  });
}

function lint(opts) {
  init(opts);

  var appendExtToDir = function (all, current) {
    all.push(current);
    var appended = current.replace(/(^|\/)(\w+)\/?$/, '$1$2/**/*.' + opts.ext);
    if (appended !== current) all.push(appended);
    return all;
  };

  var ignore = opts.exclude.reduce(appendExtToDir, []).concat('node_modules/**'),
    patterns = opts.include.reduce(appendExtToDir, []);

  if (patterns.length) {
    patterns = glueGlobPatterns(patterns);
  } else {
    patterns = '**/*.' + opts.ext;
  }
  glob(
    patterns,
    { nodir: true, ignore: ignore },
    function (err, files) { if (err) throw err; lintFiles(files, opts); }
  );
}

function filterFiles(files, key) {
  return files.filter(function (file) {
    var ext = file.split('.').pop();
    if (!ext) return false;
    if (CONFIG[key].extensions.indexOf(ext) >= 0) return true;
  });
}

function lintFiles(files, opts) {

  if (!files.length) return console.error('No lint files!');

  log('Found files: ', files, '\n');

  var tasks = [];

  function getBinFile(key) {
    return path.join(CS_ROOT, 'node_modules', '.bin', CONFIG[key].bin || key);
  }

  var verbose = DEBUG ? ['--verbose'] : [];
  var jshintReporter = ['--reporter', path.join(CS_ROOT, 'node_modules', 'jshint-stylish')];
  var injectArgs = {
    jshint: verbose.concat(jshintReporter),
    jscs: verbose,
    eslint: [],
    sasslint: ['--verbose'] // 总是 verbose
  };

  Object.keys(CONFIG).forEach(function (key) {
    if (opts[key] || opts.auto) {

      var filtered = opts.auto ? filterFiles(files, key) : files;
      if (!filtered.length) return false;

      tasks.push(function (done) {
        console.log('\r\nRunning ' + key + '...');

        var args = [getBinFile(key)].concat(injectArgs[key]);
        args.push('--config', opts[key + 'Config']);
        args.push.apply(args, filtered);
        log('node ' + args.join(' '));

        h.spawn('node', args, function (code) {
          if (code === 0 && CONFIG[key].outputSuccess) console.log('No code style errors found.');
          if (code !== 0 && !opts.force) done(code);
          else done(null, code);
        });

      });
    }
  });

  if (!tasks.length) return console.error('No lint tasks!');

  async.series(tasks, function (err, results) {
    process.exit(err || results.reduce(function (all, cur) { return all + cur; }, 0));
  });
}

module.exports = function (cfg) {
  CONFIG = cfg;
  return {
    lint: lint,
    write: write
  };
};




