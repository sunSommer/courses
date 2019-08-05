### TypeScript
TypeScript 是 JavaScript 的一个超集，它可以编译成纯的JavaScript。TypeScript可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

TypeScript由微软开发的自由和开源的编程语言。
1. TypeScript的安装和编译

安装
```
cnpm i typescript -g

tsc helloworld.ts  //生成同文件名的js文件
```
生成配置文件
```
tsc init

tsc  //执行编译
```
vscode运行
```
终端 ----> 运行任务 ----> tsc:监视-tscconfig.json
```
2. 与TypeScript的区别
```
TypeScript 从核心语言方面和类概念的模塑方面对 JavaScript 对象模型进行扩展。
JavaScript 代码可以在无需任何修改的情况下与 TypeScript 一同工作，同时可以使用编译器将 TypeScript 代码转换为 JavaScript。
TypeScript 通过类型注解提供编译时的静态类型检查。
TypeScript 中的数据要求带有明确的类型，JavaScript不要求。
TypeScript 为函数提供了缺省参数值。
TypeScript 引入了 JavaScript 中没有的“类”概念。
TypeScript 中引入了模块的概念，可以把声明、数据、函数和类封装在模块中。
```

3. TypeScript的基础类型

1). 布尔
###### 在JavaScript和TypeScript里叫做boolean。
```
例：let isDone: boolean = false;
```
2). 数字
###### 和JavaScript一样，TypeScript里的所有数字都是浮点数。除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。
```
例：let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```
3).字符串
###### 处理网页或服务器端的文本数据,使用 string表示文本数据类型。
```
例：let name: string = "bob";
name = "smith";
```
###### 还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ `），并且以${ expr }这种形式嵌入表达式
```
例：let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```
这与下面定义sentence的方式效果相同：
```
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```
4).数组
###### 有两种方式可以定义数组。 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：
```
let list: number[] = [1, 2, 3];
```
###### 第二种方式是使用数组泛型，Array<元素类型>：
```
let list: Array<number> = [1, 2, 3];
```
5).元祖 Tuple
###### 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
```
// Declare a tuple type 定义了一对值分别为string和number类型的元祖
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```
当访问一个已知索引的元素，会得到正确的类型：
```
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```
当访问一个越界的元素，会使用联合类型替代：
```
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```
6).枚举
###### enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
```
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
默认情况下，从0开始为元素编号。 也可以手动的指定成员的数值。
```
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;

enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```
枚举类型提供的一个便利是你可以由枚举的值得到它的名字。
```
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
```
7).Any
###### 在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么就可以使用 any类型来标记这些变量：
```
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```
8).Void
###### void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void。声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
```
function warnUser(): void {
    console.log("This is my warning message");
}
```
9).Null和Undefined
###### 默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。
###### 然而，strictNullChecks 参数用于新的严格空检查模式。当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。
```
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```
10).Never
###### never类型表示的是那些永不存在的值的类型。never类型是任何类型的子类型，也可以赋值给任何类型
```
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```
11).Object
###### object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
```
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```