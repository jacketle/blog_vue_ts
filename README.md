# blog_vue_ts项目

一个前端基于Vue 3、TypeScript和Vite，后端基于Djang和Django REST Framework构建的个人博客论坛系统。主要功能有登录注册，markdown文章发布，可以嵌入B站视频，网易云音乐，编辑文章，后台管理等，并且支持RESTful API接口。

## 技术栈

- 框架 : Vue 3 + TypeScript
- 构建工具 : Vite
- 状态管理 : Pinia
- 路由 : Vue Router
- UI框架 : TailwindCSS + DaisyUI
- HTTP客户端 : Axios
- 图标库 : Iconify
- Markdown处理 : markdown-it
- 富文本编辑器 : Vditor

## 项目结构

```
src/
├── api/          # API服务
├── assets/       # 静态资源
├── components/   # 组件
├── router/       # 路由配置
├── stores/       # 状态管理
├── types/        # TypeScript类型定义
├── utils/        # 工具函数
├── views/        # 页面视图
└── main.ts       # 入口文件
```

## 环境要求

- Node.js >= 16.x
- pnpm >= 8.x

## 安装步骤

1.将项目下载到本地

2.使用`pnpm install`安装依赖

3.配置环境变量.env

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## 主要依赖

- Vue 3.5.13
- Vue Router 4
- Pinia 3.0.3
- Axios 1.10.0
- TailwindCSS 3.4.17
- DaisyUI 4.6.2
