# JavaScript 编码规范

每个人或者每个公司都应该有一个 JavaScript 的编码规范，而且这个规范一般是不会变的，
我们可以要求每人在项目目录或者个人目录下放上 .jshintrc 或 .jscsrc 或 .eslintrc，
但你不觉得这样很麻烦吗？


此工具是基于我的个人编码习惯，同时结合了公司（沪江）里的一些规范，将 [jshint][jshint],
[jscs][jscs], [eslint][eslint] 三者组装起来的一个工具，它不需要在项目下包含任何的相关
配置文件，只要运行一下 `check-style` 或缩写 `cs`；就会自动检查 js 文件中不符合规范的地方。
另外，也可以检查 jsx 文件的编码风格！


对于其他想利用此工具的用户：

1. 如果你的编码风格和下面说的一致的话，那么恭喜你，你直接全局安装此工具，直接使用就行。
2. 如果你的编码风格和下面的不一样，那么建议你 `fork` 此项目，修改其中的规范，
  然后换个名称发布你的项目，这样你也可以使用你自己风格的此工具了。
3. 如果你嫌第 2 步太麻烦了，你可以执行 `check-style write` 将配置文件写入你的项目目录，
  手动修改写入后的配置文件即可

_灵感来自于 [standard](https://github.com/feross/standard)，只是它强制要求你使用它的规范，没有自定义的可能，当然也不支持 jsx 文件_


## 使用

1. 先全局安装 `check-style` 工具

    ```bash
    npm --global install check-style
    ```

2. 在项目目录下运行以下命令：

    __自动检查项目目录下的所有 js 文件__

    ```bash
    cs
    # 或者使用长命令：check-style
    ```

    __也可以检查指定的 js 文件：__

    ```bash
    cs file1 file2
    ```

    __如果你是 jsx 文件，需要检查它的语法，可以这样用：__

    ```bash
    cs --jsx --ext jsx # 假设你的 jsx 文件是以 .jsx 为后缀命名的
    ```


3. 如果想查看 `.jscsrc` 或 `.jshintrc` 或 `.eslint` 中某个字段的意思，直接运行：

    ```bash
    cs manual jscs  disallowMultipleSpaces
    ```

4. 更多命令用 `cs -h` 查看


## jscs 相关规范

### 我推荐的规范

- [在语句中不允许连续的多个 空格 或 TAB（不包括 indent）](http://jscs.info/rule/disallowMultipleSpaces)
- [逗号不要写在每行的开始位置](http://jscs.info/rule/requireCommaBeforeLineBreak)
- [语句后面需要写 `;`](http://jscs.info/rule/requireSemicolons)
- [函数参数之间要使用空格](http://jscs.info/rule/requireSpaceBetweenArguments)
- [三元操作符之间要使用空格](http://jscs.info/rule/requireSpacesInConditionalExpression)
- [for 循环参数中的分号后需要有空格](http://jscs.info/rule/requireSpacesInForStatement)
- [定义函数时的大括号前需要使用空格](http://jscs.info/rule/requireSpacesInFunction)

```json
"esnext": true,
"validateJSDoc": { "checkParamNames": true, "requireParamTypes": true },
"disallowMultipleSpaces": true,
"requireCommaBeforeLineBreak": true,
// "requireSemicolons": true, // jshint 中已经有此判断了
"requireSpaceBetweenArguments": true,
"validateParameterSeparator": ", ",
"requireSpacesInConditionalExpression": true,
"requireSpacesInForStatement": true,
"disallowSpacesInFunctionDeclaration": { "beforeOpeningRoundBrace": true },
"requireSpacesInFunction": { "beforeOpeningCurlyBrace": true },
// "requireYodaConditions": true,
"disallowKeywords": ["with", "eval"],
"disallowKeywordsOnNewLine": ["else"],
"disallowTrailingWhitespace": true,
"requireLineFeedAtFileEnd": true,
"requireCurlyBraces": ["try", "catch"],
```

### 空格

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

### 对齐和缩进

- 必须采用 2 个空格，不得使用 TAB
- 未结束的语句在换行后必须多一次缩进

```json
"validateIndentation": 4,
"disallowMixedSpacesAndTabs": true,
```

### 换行

- `if`, `do`, `for`, `while` 等关键字前
- 运算符处换行时，运算符必须在新行的行首


```json
"requireKeywordsOnNewLine": ["while", "do"],
"disallowOperatorBeforeLineBreak": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
"requireOperatorBeforeLineBreak": [","],
```


### 命名

- 构造函数首字母大写

```json
"requireCapitalizedConstructors": true,
```


[jshint]: http://jshint.com/
[jshint_rules]: http://jshint.com/docs/options/
[jscs]: http://jscs.info/
[jscs_rules]: http://jscs.info/rules.html
[eslint]: http://eslint.org/
[eslint_rules]: http://eslint.org/docs/rules/
[bad_line_break]: http://stackoverflow.com/questions/15140740/explanation-of-jshints-bad-line-breaking-before-error
