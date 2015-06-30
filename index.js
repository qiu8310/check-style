/**
 * @file JavaScript 编码规范主文件
 * @author Mora <qiuzhonglei@hujiang.com>
 */

var fs = require('fs-extra'),
    path = require('path'),
    async = require('async'),
    glob = require('glob');

var h = require('./lib/helper.js');
var CS_ROOT = __dirname, PKG_ROOT, DEBUG = false;
var ENGINES = ['jshint', 'jscs', 'eslint'];

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
  if (!opts.ext || opts.ext.length === 0) opts.ext = 'js';
  else opts.ext = glueGlobPatterns(opts.ext.map(function (ext) { return ext.replace(/^\./, ''); }));

  // 没有指定使用任何的分析引擎，则使用默认的 jshint 和 jscs
  if (ENGINES.every(function (k) { return !opts[k]; })) opts.jshint = opts.jscs = true;

  ENGINES.forEach(function (key) {
    var configKey = key + 'Config', rcFile = '.' + key + 'rc';

    // 获取启用了的引擎的配置文件
    if (!opts[configKey] && opts[key])
      opts[configKey] = h.file(PKG_ROOT, rcFile) || path.join(CS_ROOT, rcFile);
  });
}

function log() { if (DEBUG) console.log.apply(console, arguments); }

function copy(src, dist) {
  console.log('Copy ' + src + ' => ' + dist);
  h.copy(src, dist);
}

function write(opts) {
  init(opts);

  ENGINES.forEach(function (k) {
    if (opts[k]) {
      var src = path.resolve(opts[k + 'Config']),
        dist = path.resolve(path.join(PKG_ROOT, '.' + k + 'rc'));

      if (src === dist) console.error('目标文件和源文件地址一样（' + src + '）');
      else if (fs.existsSync(dist)) console.error('目标文件已经存在（' + dist + '），请删除后再重试');
      else copy(src, dist);
    }
  });
}

module.exports = function (opts) {
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
    function (err, files) { if (err) throw err; hint(files, opts); }
  );
};

module.exports.write = write;

function hint(files, opts) {

  if (!files.length) {
    console.error('No js files!');
    process.exit(1);
  }

  log('Found files: ', files, '\n');

  var tasks = [];

  function getBinFile(key) { return path.join(CS_ROOT, 'node_modules', '.bin', key); }

  var verbose = DEBUG ? ['--verbose'] : [];
  var jshintReporter = ['--reporter', path.join(CS_ROOT, 'node_modules', 'jshint-stylish')];
  var injectArgs = {
    jshint: verbose.concat(jshintReporter),
    jscs: verbose,
    eslint: []
  };

  ENGINES.forEach(function (key) {
    if (opts[key]) {
      tasks.push(function (done) {
        console.log('Running ' + key + '...');
        var args = [getBinFile(key)].concat(injectArgs[key]);
        args.push('--config', opts[key + 'Config']);
        args.push.apply(args, files);
        log('node ' + args.join(' '));
        h.spawn('node', args, function (code) {
          if (code !== 0 && !opts.force) done(code);
          else done(null, code);
        });
      });
    }
  });

  async.series(tasks, function (err, results) {
    process.exit(err || results.reduce(function (all, cur) { return all + cur; }, 0));
  });
}
