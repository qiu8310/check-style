/**
 * @file JavaScript 编码规范测试文件
 * @author Mora <qiuzhonglei@hujiang.com>
 * @see {@link http://ue.hujiang.com/u/dayu826/article/5366ebbe384a291427bb2c4e}
 */


/**
 * 全局变量说明
 *
 * @type {number}
 */
var currentStep = 1 + 2
    + 3;

/**
 * 编码规范测试脚本集
 * @namespace
 */
var Test = {
    /**
     * 值变更时触发
     *
     * @event
     * @param {Object} e e描述
     * @param {string} e.before before描述
     * @param {string} e.after after描述
     */
    onchange: function (e) {
        console.log(currentStep);
    }
};


module.exports = Test;
