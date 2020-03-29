# uAid Clipboard —— 基于Electron的一个小工具的自我总结

<a name="vwllp"></a>
## 简介
<a name="acgFe"></a>
### 概述
场景背景：现在但凡有一点深度讲解的文章动辄上万字，当我们沉浸式阅读时，为了保证阅读质量会避免不必要的应用切换，但是又要做文章的摘要，uAid Clipboard 提供了这个功能，而你要做的只是选中句子右键复制，Clipboard 会帮你记录好，等你完成连续性阅读后再回过头来复习下看看你做了什么。<br />技术背景：尝试下Electron应用开发<br />

<a name="7FWQ3"></a>
### 使用介绍
<a name="zADQV"></a>
#### 主面板
![Screen Shot 2020-03-29 at 17.15.45.png](https://cdn.nlark.com/yuque/0/2020/png/86538/1585473298938-7e5a6c7c-76c5-4f9b-b9b6-e87694a5d4cc.png#align=left&display=inline&height=1800&name=Screen%20Shot%202020-03-29%20at%2017.15.45.png&originHeight=1800&originWidth=2880&size=4474101&status=done&style=none&width=2880)<br />
<br />![Screen Shot 2020-03-29 at 17.23.22.png](https://cdn.nlark.com/yuque/0/2020/png/86538/1585473762442-29493d62-a099-41b1-a588-e8d8195de116.png#align=left&display=inline&height=1074&name=Screen%20Shot%202020-03-29%20at%2017.23.22.png&originHeight=1074&originWidth=1916&size=357418&status=done&style=none&width=1916)<br />
<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/86538/1585473915973-beec80e9-b3f5-4afe-842e-758f96093dcc.png#align=left&display=inline&height=1066&name=image.png&originHeight=1066&originWidth=1908&size=309067&status=done&style=none&width=1908)<br />

<a name="xJbbf"></a>
### 关于隐私
uAid Clipboard 记录的内容都保存在你的本地，绝对不会上传到服务，你可以从源码上分析出来。<br />

<a name="NFgfp"></a>
### 安装
有2种形式来获取安装包：

1. 直接下载dmg文件安装，安装包地址：(暂不提供)。注意：受到苹果开发者权限限制，安装后无法打开应用，可以通过右键应用打开的方式打开，访达(Finder) -> 应用程序(Applications) -> uaid Clipboard -> 右键 -> 打开（open）
1. 下载原码包本地构建安装
  1. git clone git@github.com:cowboykx/uaid-clipboard.git
  1. cnpm install
  1. npm run pack
  1. cd dist
  1. open dmg file



<a name="Cq8Ol"></a>
## 架构
<a name="Zaq8c"></a>
### 运行环境依赖
![image.png](https://cdn.nlark.com/yuque/0/2020/png/86538/1585467997491-de46829b-d826-4e03-924d-bf0381208ad6.png#align=left&display=inline&height=167&name=image.png&originHeight=167&originWidth=890&size=44620&status=done&style=none&width=890)<br />

- 整体面向用户侧使用React，状态管理使用 mobx，快捷键使用hotkeys-js
- nodejs执行环境使用了，menubar来做菜单样式，nedb来处理本地存储，electron-clipboard-watcher 来监听系统粘贴板信息



<a name="0HqqW"></a>
### 编译环境
![image.png](https://cdn.nlark.com/yuque/0/2020/png/86538/1585467536331-f6d0dfdc-c98b-42f6-9e15-1f0c481f41eb.png#align=left&display=inline&height=183&name=image.png&originHeight=244&originWidth=644&size=61381&status=done&style=none&width=483)<br />
<br />这里 main.js 指的是在electron nodejs执行环境的js文件，考虑webpack编译nodejs文件没带来太多的价值，只是使用tsc做了一个typescript的编译功能。在webkit执行的 js browser.js 和 preload.js 使用了webpack打包<br />

<a name="Dt1SY"></a>
## 遇到的问题
<a name="QQ40u"></a>
### webpack 构建器
webpack打包nodejs文件：起初想用webpack打包nodejs文件，需要在webpack配置文件里配置nodejs各种环境，例如 __dirname，但是总体来说带来的收益不大，后来直接使用 ts 做编译。<br />
<br />配置 __dirname，参考文档：[https://zhuanlan.zhihu.com/p/20782320](https://zhuanlan.zhihu.com/p/20782320)
```shell
...
context: __dirname,
node: {
    __filename: false,
    __dirname: false
},
...
```


<a name="EBymH"></a>
### babel@8.x.x 的配置
起初没有引入ts，使用babel来编译js，配置webpack和babel真的是一个头疼的事情，花了不少时间，一定要注意babel 和 babel-loader版本，这里记录先之前配置的信息<br />
<br />package.json
```json
{
  "@babel/cli": "^7.0.0-beta.40",
  "@babel/core": "^7.0.0-beta.40",
  "@babel/plugin-proposal-class-properties": "^7.8.3",
  "@babel/plugin-proposal-decorators": "^7.8.3",
  "@babel/preset-env": "^7.8.4",
  "@babel/preset-es2015": "^7.0.0-beta.53",
  "@babel/preset-react": "^7.0.0-beta.40",
  "@babel/preset-stage-0": "^7.0.0",
  "babel-loader": "^8.0.0-beta.0",
  "css-loader": "^3.4.2",
  "extract-text-webpack-plugin": "^4.0.0-beta.0",
  "less": "^3.11.1",
  "less-loader": "^5.0.0",
  "style-loader": "^1.1.3",
  "webpack": "^4.41.6",
  "webpack-cli": "^3.3.11"
}
```

<br />webpack.config.js
```javascript
const Ex = require('extract-text-webpack-plugin');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

module.exports = {
  mode: 'production',
  entry: {
    'browser': './src/browser/index.jsx'
  },
  output: {
    path: projectRoot,
    filename: './out/[name].js'
  },
  target: 'node',
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader"
      },
      {
        test: /\.less|\.css$/,
        loader: Ex.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      }
    ]
  },
  plugins: [
    new Ex('./out/[name].css'),
  ],
  externals: {
    "antd": "antd",
    "react": "React",
    "react-dom": "ReactDOM",
    "moment": "moment"
  }
}

```


<a name="a5WuP"></a>
### typescript
<a name="fotb9"></a>
#### tsconfig.json
tsconfig没什么好说，在webpack里可以指定tsconfig，针对 browser/preload/main 分别使用三个json，
```json
{
  test: /\.(ts|tsx)?$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    configFile: path.resolve(__dirname, '../tsconfig.browser.json')
  }
}
```


<a name="mtfCu"></a>
#### tsconfig编译参数
这里只提常用的

- target：指定需要编译js的版本
- module: 指定编译后的模块方案
- lib: 指定要包含在编译中的库文件，例如："es5", "es6", "es7", "dom"
- jsx: 指定支持的jsx类型，react-native react preserve
- declaration： 是否生成 *.d.ts 文件
- outDir：输出文件目录，如果是用webpack编译的话，这个选项可以不用
- typeRoots 和 types：这2个参数用来指定 [@type](#) 文件的目录和引入哪些 types，平常我们不会用到。
  - typeRoots 默认为 ./node_modules/@types
  - types：如果设定了，就只会从 typeRoots 取对应的
- experimentalDecorators： 开启装饰器，请设置打开吧


<br />如下为我常用的配置<br />
<br />tsconfig.base.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "allowJs": false,
    "alwaysStrict": true,
    "importHelpers": true,
    "lib": ["es5", "es6", "es7", "dom"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "noEmitOnError": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "sourceMap": false,
    "declaration": false,
    "declarationMap": false,
    "target": "es2017",
    "resolveJsonModule": true,
    "paths": {
    }
  }
}
```

<br />tsconfig.node.json<br />

```json
{
  "extends": "./tsconfig.base",
  "compilerOptions": {
    "target": "ES5",
    "outDir": "out/node"
  },
  "include": [
    "./src/node"
  ]
}
```


<a name="YO8PU"></a>
### Mobx
<a name="nvkfx"></a>
#### mobx store
请开启 enforceActions，修改数值必须通过 action<br />

```javascript
import { configure } from 'mobx';

configure({
  enforceActions: true
});
```


<a name="8oZha"></a>
#### mobx 异步修改状态
大部分时间我们使用 async/await 来做协程，async 函数里我们只能通过 runInAction 来改变状态

```javascript
import { runInAction, action } from 'mobx';

class Store {
 ...
 @action
	update() {
  	...
    runInAction(() => {
    	...
    })
    ...
  }
 
 ...
  
}
```


<a name="Ph5LL"></a>
### npm
<a name="JmeEK"></a>
#### 关闭 package-lock.json 文件生成
vim ~/.npmrc
```html
package-lock=false
```


<a name="ZixUz"></a>
#### 设置淘宝源
vim ~/.npmrc
```html
registry=https://registry.npm.taobao.org/
```


<a name="PSc7J"></a>
### Electron


<a name="jl6Vr"></a>
#### 设置 electron 源文件地址
受到网络影响，国外站点的资源无法获取，可以设置下electron的国内镜像地址<br />vim ~/.npmrc<br />

```html
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
```


<a name="m2hzu"></a>
#### CSP 同源策略
在html里异步加载资源会报错，例如antd在做状态时会动态插入一些样式，这个时候你需要指定下同源策略<br />

```html
<head>
	<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline'; script-src 'self'">
	<meta http-equiv="X-Content-Security-Policy" content="default-src 'unsafe-inline'; script-src 'self'">
</head>
```


<a name="6y4N9"></a>
#### 打包
使用 electron-builder 打包（[https://www.electron.build/](https://www.electron.build/)），包的icon放到 根目录的build目录下，[https://www.electron.build/icons](https://www.electron.build/icons)<br />
<br />打包脚本，package.json<br />

```html
scripts: {
	"pack": "npm run build && electron-builder --mac --x64"
}
```


<a name="6VVXl"></a>
#### 打包镜像下载

<br />electron-builder 在打包时会检测cache中是否有electron 包，如果没有的话会从github上拉去，在国内网络环境中拉取的过程大概率会失败，所以你可以自己去下载一个包放到cache目录里，参考：[https://github.com/electron/get#how-it-works](https://github.com/electron/get#how-it-works)<br />
<br />各个平台的目录地址

- Linux: $XDG_CACHE_HOME or ~/.cache/electron/
- MacOS: ~/Library/Caches/electron/
- Windows: %LOCALAPPDATA%/electron/Cache or ~/AppData/Local/electron/Cache/


<br />例如在macos平台打包electron应用，执行 electron-builder --mac --x64<br />

```
➜  clipboard git:(master) ✗ npm run dist
> clipboard@1.0.0 dist /Users/xx/workspace/electron/clipboard
> electron-builder --mac --x64
  • electron-builder  version=22.3.2 os=18.7.0
  • loaded configuration  file=package.json ("build" field)
  • writing effective config  file=dist/builder-effective-config.yaml
  • packaging       platform=darwin arch=x64 electron=8.0.0 appOutDir=dist/mac
  • downloading     url=https://github.com/electron/electron/releases/download/v8.0.0/electron-v8.0.0-darwin-x64.zip size=66 MB parts=8
```

<br />可以单独下载这个包 [https://github.com/electron/electron/releases/download/v8.0.0/electron-v8.0.0-darwin-x64.zip，](https://github.com/electron/electron/releases/download/v8.0.0/electron-v8.0.0-darwin-x64.zip%EF%BC%8C) 放到~/Library/Caches/electron/ 目录下<br />
<br />谢谢
