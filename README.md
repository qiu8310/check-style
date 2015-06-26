# JavaScript 编码规范

基于 [沪江的 JavaScript编码规范](http://ue.hujiang.com/u/dayu826/article/5366ebbe384a291427bb2c4e)，
你可以直接应用以下的规范，或者你也可以通过 `cs build [init]` 来编译你自己的规范。

> 有代码规范的地方就应该指定 [.jshintrc][jshint_options] 和 [.jscsrc][jscs_rules] 文件。
>
> 每个使用此规范的人在提交代码时都需要用 [jshint][jshint] 和 [jscs][jscs] 对代码进行检查，
> 并修证出现的代码不规范的地方！
>
> 注意两者规范不要重复，比如 jshint 和 jscs 都可以检查每行的最大字符长度，我们只要在一个地方检查就
> 行了，而且原则是以 jshint 为主，jshint 不能做的才用 jscs 去做。
>

## 使用

1. 先全局安装 `check-style` 工具

    ```bash
    npm --global install check-style jshint@^2.8.0 jscs@^1.13.0
    ```

    依赖于外部的 `jshint` 和 `jscs` 命令

2. 在项目目录下运行以下命令：

    ```bash
    cs # 或者使用长命令：check-style
    ```

3. 如果想查看 `.jscsrc` 或 `.jshintrc` 中某个字段的意思，直接运行：

    ```bash
    cs -m disallowMultipleSpaces # 会自动判断属性是在 jscs 还是在 jshint 中的
    ```

    或者

    ```bash
    cs --jscs disallowMultipleSpaces
    ```

4. 更多命令用 `cs -h` 查看


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
"esnext": true,
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

- 必须采用 4 个空格，不得使用 TAB
- 未结束的语句在换行后必须多一次缩进

```json
"validateIndentation": 4,
"disallowMixedSpacesAndTabs": true,
```

## 换行

- `if`, `do`, `for`, `while` 等关键字前
- 运算符处换行时，运算符必须在新行的行首


```json
"requireKeywordsOnNewLine": ["while", "do"],
"disallowOperatorBeforeLineBreak": ["+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">", ">=", "<", "<="],
"requireOperatorBeforeLineBreak": [","],
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
