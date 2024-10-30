# rnacos-console

r-nacos server's console front-end project


r-nacos 控制台前端，r-nacos中通过引用发布后的前端文件使用。

## 本工程开发流程

### 1、node环境

1. 安装node，版本号建议 >= v18.x ;

### 2. 安装npm依赖 

```
npm install
```

### 3. 运行r-nacos服务以提供后端接口

本功能运行时需要请求对应的后端接口，后端接口的地址在`vite.config.ts`中配置,默认为`http://127.0.0.1:10848`。

在本机启动r-nacos服务后，即可请求到对应的控制台后端接口。

r-nacos服务启动方式参考 [r-nacos readme](https://github.com/nacos-group/r-nacos)

### 4. 运行开发工程

在项目目录运行`npm run dev`后即可启动项目测试服务，然后通过`http://localhost:5173/rnacos/`进入控制台。


### 5. 开发

使用vscode 或者其它IDE 开始编码开发。

### 6. 代码格式化

提交代码前需要运行 `npm run format` 对代码进行统一的格式化。

### 7. 提交代码

提交代码，并提PR。


