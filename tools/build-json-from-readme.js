/**
 * @file 将 readme 中的 json 脚本提取出来存到指定的文件中
 *
 * @author Mora <qiuzhonglei@hujiang.com>
 *
 */

var fs = require('fs'),
    path = require('path');

module.exports = function (opts) {
    opts = opts || {};

    var README_FILE = opts.md || path.join(__dirname, '..', 'README.md'),
        JSON_FILE = opts.rc || path.join(__dirname, '..', '.jscsrc');

    var jsonFromReadme = getJsonDataFromMarkdown(readFile(README_FILE));
    fs.writeFileSync(JSON_FILE, JSON.stringify(jsonFromReadme, null, '    '));
    console.log('Generage ' + path.resolve(JSON_FILE) + ' successfully!');
};

if (process.argv[1] === __filename) {
    module.exports();
}


/**
 * 读取文件内容，也可以返回 JSON
 *
 * @param {String} filePath - 文件路径
 * @param {Boolean} [ifReturnJson] - 是否返回 JSON，而不是字符串
 * @returns {Object|String}
 */
function readFile(filePath, ifReturnJson) {
    var content = fs.readFileSync(filePath).toString();
    return ifReturnJson ? JSON.parse(content) : content;
}

/**
 * 提取一段 markdown 文本中的 json 代码
 *
 * @param {String} content - markdown 文本
 * @returns {Object} 返回提取出的 json
 */
function getJsonDataFromMarkdown(content) {

    var result = [];

    var isLineDefine = function (line) {
        return /^\s*"[\w-]+"\s*:\s*/.test(line);
    };

    var addCommaToLine = function (line) {
        return line.replace(/,?\s*$/, ',');
    };

    content.replace(/^```json\s([\s\S]+?)\s```/gm, function (all, code) {
        // 去掉 code 中的注释行
        code = code.replace(/^\/\/.*$/mg, '');

        // 给没加逗号的行补充逗号
        var lastLine, lines = code.split(/[\r]?\n/);

        lines.forEach(function (line, index) {
            line = line.trim();
            if (!line) return ;

            // 当前行是一个新的定义，上一非空行就需要以逗号结尾
            if (isLineDefine(line) && lastLine) {
                lastLine = addCommaToLine(lastLine);
            }

            if (lastLine) { result.push(lastLine); }
            lastLine = line;
        });

        if (lastLine) { result.push(lastLine); }
    });


    // 去掉 result 中的最后一行的逗号
    var len = result.length;
    if (len) result[len - 1] = result[len - 1].replace(/,\s*$/, '');

    result = '{' + result.join('\n') + '}';

    try {
        return JSON.parse(result);
    } catch (e) {
        console.log(result);
        console.log(e.stack);
    }
}
