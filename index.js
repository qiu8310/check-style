/**
 * @file JavaScript 编码规范主文件
 * @author Mora <qiuzhonglei@hujiang.com>
 */

var fs = require('fs-extra'),
    path = require('path'),
    glob = require('glob');

var h = require('./tools/helper.js');
var CS_ROOT = __dirname;
var DEBUG, PKG_ROOT;

function init(opts) {
    var pkgFile = h.up('package.json');
    PKG_ROOT = pkgFile ? path.dirname(pkgFile) : process.cwd();
    DEBUG = opts.debug;
}

function copy(src, dist) {
    log('Copy ' + src + ' => ' + dist);
    h.copy(src, dist);
}

module.exports = function (opts) {

    init(opts);

    var appendExtToDir = function (pat) {
        return pat.replace(/(^|\/)(\w+)\/?$/, '$1$2/**/*.js');
    };

    if (opts.write) {
        if (PKG_ROOT !== CS_ROOT) {
            ['.jscsrc', '.jshintrc'].forEach(function (file) {
                var pkgFile = path.join(PKG_ROOT, file),
                    csFile = path.join(CS_ROOT, file);
                if (!fs.existsSync(pkgFile)) copy(csFile, pkgFile);
            });
        }
    }

    var ignore = opts.exclude.map(appendExtToDir).concat('node_modules/**'),
        patterns = opts.include.map(appendExtToDir);

    if (!patterns.length) {
        patterns = '**/*.js';
    } else if (patterns.length === 1) {
        patterns = patterns[0];
    } else {
        patterns = '{' + patterns.join(',') + '}';
    }


    glob(
        patterns,

        {
            nodir: true,
            ignore: ignore
        },

        function (err, files) {
            if (err) throw err;
            hint(files, {
                jscsConfig: opts.jscsConfig || h.file(PKG_ROOT, '.jscsrc'),
                jshintConfig: opts.jshintConfig || h.file(PKG_ROOT, '.jshintrc')
            });
        }
    );
};

module.exports.buildInit = function (opts) {
    init(opts);
    copy(path.join(CS_ROOT, 'README.md'), path.join(PKG_ROOT, 'cs.md'));
};

module.exports.build = function (opts) {
    init(opts);

    var md = opts.md || path.join(PKG_ROOT, 'cs.md');

    if (!fs.existsSync(md)) {
        console.error('Not found ' + md + ' file.');
        console.error('Please run `cs build init` first!');
        process.exit(1);
    }

    require('./tools/build-json-from-readme.js')({
        md: md,
        rc: path.join(PKG_ROOT, '.jscsrc')
    });
};


function log() {
    if (DEBUG) console.log.apply(console, arguments);
}

function hint(files, options) {
    if (!files.length) {
        console.error('No js files!');
        process.exit(1);
    }

    var jshintConfig = options.jshintConfig || path.join(CS_ROOT, '.jshintrc'),
        jscsConfig = options.jscsConfig || path.join(CS_ROOT, '.jscsrc');

    var verbose = DEBUG ? '--verbose' : [];
    var jshintReport = [
        '--reporter',
        path.join(CS_ROOT, 'node_modules', 'jshint-stylish')
    ];
    var jshintArgs = ['-c', jshintConfig].concat(jshintReport, verbose, files),
        jscsArgs = ['-c', jscsConfig].concat(verbose, files);

    var spawnOpts = { stdio: 'inherit' };

    console.log('Running jshint...');
    log('jshint ' + jshintArgs.join(' '));
    h.spawn(
        'jshint',
        jshintArgs,
        function (code) {
            if (code === 0) {
                console.log('Running jscs...\n');
                log('jscs ' + jscsArgs.join(' '));
                h.spawn('jscs', jscsArgs);
            } else {
                process.exit(code);
            }
        },
        spawnOpts
    );
}
