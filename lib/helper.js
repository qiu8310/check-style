var path = require('path'),
  fs = require('fs-extra'),
  spawn = require('cross-spawn');


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
   * @param {Object} [spawnOpts]
   */
  spawn: function (cmd, args, cb, spawnOpts) {

    if (typeof args === 'function') {
      spawnOpts = cb;
      cb = args;
      args = [];
    }

    if (typeof cb === 'object') {
      spawnOpts = cb;
      cb = null;
    }

    if (!spawnOpts) spawnOpts = { stdio: 'inherit' };

    if (!cb) {
      return spawn(cmd, args, spawnOpts);
    } else {
      var ps = spawn(cmd, args, spawnOpts);
      var out = '', err = '';

      if (ps.stdout) {
        ps.stdout.on('data', function (data) {
          out += data.toString();
        });
        ps.stderr.on('data', function (data) {
          err += data.toString();
        });
      }

      ps.on('close', function (status) { cb(status, out, err); });
    }
  }
};
