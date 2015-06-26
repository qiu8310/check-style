# JavaScript 编码规范

基于 [沪江的 JavaScript编码规范](http://ue.hujiang.com/u/dayu826/article/5366ebbe384a291427bb2c4e)，
你可以直接应用以下的规范，或者你也可以修改源码中的规范以应用到你自己的项目中。

> 有代码规范的地方就应该指定 [.jshintrc][jshint_options] 和 [.jscsrc][jscs_rules] 文件。
>
> 每个使用此规范的人在提交代码时都需要用 [jshint][jshint] 和 [jscs][jscs] 对代码进行检查，
> 并修证出现的代码不规范的地方！
>
> 注意两者规范不要重复，比如 jshint 和 jscs 都可以检查每行的最大字符长度，我们只要在一个地方检查就
> 行了，而且原则是以 jshint 为主，jshint 不能做的才用 jscs 去做。
>
> 你可以使用 grunt 或 gulp 中的相关 task 对 js 文件处理，
> 也可直接使用工具本身提供的命令行。
>

__下文中的 `NA`，意思为 `Not Accept`，即我不认同沪江原文中的规范__

## 使用

1. 先全局安装 `check-style` 工具

    ```bash
    npm --global install check-style
    ```

2. 在项目目录下（__项目的根目录需要存在 `package.json` 文件__）运行以下命令：

    ```bash
    check-style
    ```

    此命令会按以下步骤执行：

    1. 遍历根目录和根目录的子目录，得到 jsFileLabel 是 `*.js` 还是 `*/*.js` 还是 `*.js */*.js`
    2. 复制 `check-style` 目录下的 `.jshintrc` 和 `.jscsrc` 文件到你项目的根目录（如果存在，不会覆盖）
    3. 给 `package.json` 中的 `scripts.test` 添加 `jshint {$jsFileLabel} && jscs {$jsFileLabel}` 前缀 (如果存在不会重复添加)
    4. 给 `package.json` 中的 `devDependencies` 添加 `jshint` 和 `jscs` 的依赖，如果添加成功执行 `npm install` 命令
    5. 如果第 1 步中有找到任何的 js 文件，则执行 `npm test` 命令，否则不执行任何操作

    所以运行过 `check-style` 后，下次就可以直接使用 `npm test` 即可。

3. 如果想查看 `.jscsrc` 或 `.jshintrc` 中某个字段的意思，直接运行：

    ```bash
    check-style disallowMultipleSpaces # 会自动判断属性是在 jscs 还是在 jshint 中的
    ```

    或者

    ```bash
    check-style jscs disallowMultipleSpaces
    ```



## 我推荐的规范

- [在语句中不允许连续的多个 空格 或 TAB（不包括 indent）](http://jscs.info/rule/disallowMultipleSpaces)
- [逗号不要写在每行的开始位置](http://jscs.info/rule/requireCommaBeforeLineBreak)
- [语句后面需要写 `;`](http://jscs.info/rule/requireSemicolons)
- [函数参数之间要使用空格](http://jscs.info/rule/requireSpaceBetweenArguments)
- [三元操作符之间要使用空格](http://jscs.info/rule/requireSpacesInConditionalExpression)
- [for 循环参数中的分号后需要有空格](http://jscs.info/rule/requireSpacesInForStatement)
- [定义函数时的大括号前需要使用空格](http://jscs.info/rule/requireSpacesInFunction)
- [在比较操作是，将常量放在变量的前面](http://jscs.info/rule/requireYodaConditions)

```json
// "esnext": true,
"validateJSDoc": { "checkParamNames": true, "requireParamTypes": true },
"disallowMultipleSpaces": true,
"requireCommaBeforeLineBreak": true,
"requireSemicolons": true,
"requireSpaceBetweenArguments": true,
"requireSpacesInConditionalExpression": true,
"requireSpacesInForStatement": true,
"disallowSpacesInFunctionDeclaration": { "beforeOpeningRoundBrace": true },
"requireSpacesInFunction": { "beforeOpeningCurlyBrace": true },
//"requireYodaConditions": true,
"disallowKeywords": ["with", "eval"],
"disallowKeywordsOnNewLine": ["else"],
"disallowTrailingWhitespace": true,
"requireLineFeedAtFileEnd": true,
"requireCurlyBraces": ["try", "catch"],
```

## 空格

- 除括号外，所有运算符的前后都需要有空格
- 某些关键字之后需要有空格，包括 `if`, `else`, `try`, `finally` 等
- block 语句块之前要有空格
- 行注释 `//` 后需要有空格
- 对象初始化（`{ ... }`）的每个属性名的`:`后面要有空格
- 所有逗号`,`后, __但除了逗号在行尾的情况__
- 单行的对象初始化（`{ ... }`），在`{`后面和`}`前面要有空格

```json
"disallowSpaceBeforeBinaryOperators": [","],
"disallowSpaceAfterBinaryOperators": ["!"],
"requireSpaceBeforeBinaryOperators": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
"requireSpaceAfterBinaryOperators": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
"requireSpaceBeforeBlockStatements": true,
"requireSpaceAfterKeywords": [
  "do",
  "for",
  "if",
  "else",
  "switch",
  "case",
  "try",
  "catch",
  "finally",
  "void",
  "while",
  "return",
  "typeof",
  "function"
],
"requireSpaceBeforeKeywords": ["else", "catch", "finally"],
"requireSpaceAfterLineComment": true,
"requireSpaceBeforeObjectValues": true,
```

## 对齐和缩进

- 必须采用 4 个空格，不得使用 TAB __NA:推荐使用 2 个空格，因为 JS 本来回调就多， 4 个占用的空间太多了__
- 未结束的语句在换行后必须多一次缩进

```json
"validateIndentation": 4,
"disallowMixedSpacesAndTabs": true,
```

## 换行

- `if`, `do`, `for`, `while` 等关键字前
- 运算符处换行时，运算符必须在新行的行首
  __NA:[Operator should before line break][bad_line_break]，
  JS 会自动插入分号，如果运算符在行首，有可能造成 JS 在上一行的行尾插入分号__


```json
"requireKeywordsOnNewLine": ["if", "while", "do", "for"]
"disallowOperatorBeforeLineBreak": [],
"requireOperatorBeforeLineBreak": [",", "+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
```


## 命名

- 构造函数首字母大写

```json
"requireCapitalizedConstructors": true,
```


[jshint]: http://jshint.com/
[jshint_options]: http://jshint.com/docs/options/
[jscs]: http://jscs.info/
[jscs_rules]: http://jscs.info/rules.html
[bad_line_break]: http://stackoverflow.com/questions/15140740/explanation-of-jshints-bad-line-breaking-before-error
