var path = require('path'),
    fs = require('fs-extra'),
    spawn = require('cross-spawn');


/**
 * 判断一个文件的使用的 indent 长度
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
    return indent || '  ';
}

/**
 * 逐层向上查找文件
 * @param {String} file - 要查找的文件
 * @param {String} [dir] - 查找的初始目录，如果没设定，默认使用 当前目录
 * @returns {String|Boolean} 返回文件的路径，或者 false
 */
function up(file, dir) {
    dir = dir || process.cwd();

    if (dir === '/' || /^\w:[\\\/]?$/.test(dir)) return false;

    var pkgFile = path.join(dir, file);

    if (fs.existsSync(pkgFile)) {
        return pkgFile;
    }

    return up(file, path.dirname(dir));
}



module.exports = {
    up: up,
    detectIndent: detectIndent,

    copy: function (src, dist) {
        return fs.writeFileSync(dist, fs.readFileSync(src));
    },

    file: function (dir, base) {
        if (!dir || !base) return false;

        var file = path.join(dir, base);
        return fs.existsSync(file) ? file : false;
    },

    /**
     * 调用子程序
     *
     * @param {String} cmd
     * @param {Array} [args]
     * @param {Function} [cb]
     */
    spawn: function (cmd, args, cb) {

        if (typeof args === 'function') {
            cb = args;
            args = [];
        }

        if (!cb) {
            return spawn(cmd, args, {stdio: 'inherit'});
        } else {
            var ps = spawn(cmd, args);
            var out = '', err = '';
            ps.stdout.on('data', function (data) { out += data.toString(); });
            ps.stderr.on('data', function (data) { err += data.toString(); });
            ps.on('close', function (status) { cb(status, out, err); });
        }
    }
};
