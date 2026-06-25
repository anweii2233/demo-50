# My Creative Demos

一个前端创意演示合集（Front-End Demo Collection），用于展示各种纯前端技术实现的小型项目。

## 项目简介

本项目是一个 Demo 展示画廊，主页面以卡片网格形式展示各个独立的前端 Demo，点击卡片即可在新标签页中打开对应 Demo。每个 Demo 都是自包含的独立页面，拥有自己的 HTML、CSS 和 JavaScript 文件。

### 已实现的 Demo

| Demo | 描述 | 主要技术 |
|------|------|----------|
| 拟物态时钟 | 基于 CSS box-shadow 实现的新拟物风格模拟时钟，秒/分/时指针实时转动 | CSS 新拟物风格、JS 定时器 |

### 计划中的 Demo

| Demo | 描述 | 主要技术 |
|------|------|----------|
| Canvas 粒子特效 | 基于 HTML5 Canvas 的鼠标跟随粒子动画效果 | Canvas API、高性能渲染 |
| 極簡待辦事項 | 使用 LocalStorage 持久化存储的 Todo List 应用 | DOM 操作、本地存储 |

## 技术栈

- **HTML5** — 语义化标签
- **CSS3** — Grid 布局、Flexbox、box-shadow（新拟物风格）、transition/transform 动画、响应式设计（auto-fill + minmax）
- **Vanilla JavaScript (ES6+)** — 无任何第三方框架或库，使用原生 API
  - `setInterval` 定时器
  - `Date` API 时间计算
  - 事件委托（`element.closest()`）
  - 模板字面量与箭头函数
  - `LocalStorage`（待实现）

**零依赖，零构建工具** — 项目无需 npm、打包器或转译器，直接在浏览器中打开即可运行。

## 项目结构

```
demo-50/
├── index.html                  # 主页面（Demo 画廊）
├── css/
│   └── style.css               # 全局样式（卡片网格、标签、布局）
├── js/
│   ├── demo.js                 # Demo 数据定义（DEMO_DATA 数组，唯一数据源）
│   └── main.js                 # 画廊逻辑（动态渲染卡片、点击跳转）
├── demos/
│   ├── 01-clock/
│   │   ├── index.html          # 拟物态时钟页面
│   │   ├── main.js             # 时钟逻辑（指针角度计算、定时更新）
│   │   └── style.css           # 时钟样式（新拟物风格、指针动效）
│   ├── 02-canvas-particle/     # 计划中
│   └── 03-todo-list/           # 计划中
└── README.md
```

## 开发流程

### 1. 添加新 Demo

1. 在 `demos/` 目录下新建文件夹，如 `demos/04-my-demo/`
2. 在文件夹内创建 `index.html`、`main.js`、`style.css` 三个文件
3. 在 `js/demo.js` 的 `DEMO_DATA` 数组中添加一条新记录：

```js
{
  id: '04',
  title: 'Demo 标题',
  description: '简要描述这个 Demo 的功能和特点',
  tags: ['标签1', '标签2'],
  path: 'demos/04-my-demo/index.html'
}
```

4. 刷新主页面即可在画廊中看到新卡片

### 2. 本地运行

直接在浏览器中打开 `index.html` 即可运行，无需安装任何依赖或启动开发服务器。

推荐使用 VS Code 的 **Live Server** 插件或类似工具来获得更好的开发体验（支持热重载）。

### 3. 代码规范

- 使用 ES6+ 语法（`const`/`let`、箭头函数、模板字面量）
- 每个 Demo 保持自包含，不依赖全局状态
- Demo 之间的样式使用独立选择器，避免相互污染
- 注释使用中文描述关键逻辑

## 约定

- 每个 Demo 的 `id` 使用数字字符串（如 `'01'`、`'02'`），文件夹命名格式为 `{id}-{kebab-case-name}`
- Demo 数据统一在 `js/demo.js` 中维护，`js/main.js` 负责从该数据动态渲染画廊
- 画廊仅展示状态为 `active`（默认）的 Demo，如需隐藏某个 Demo 可在数据中添加 `status` 字段进行过滤
