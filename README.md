# rnacos-console

r-nacos server's console front-end project

r-nacos 控制台前端，r-nacos中通过引用发布后的前端文件使用。

## 本工程开发流程

### 1、node环境

1. 安装node，版本号建议 >= v18.x ;

### 2. 配置文件

本功能运行时需要请求对应的后端接口，默认为`http://127.0.0.1:10848`。
```
cp .env.example .env
```

### 3. 安装 NPM

```
npm install 
```

在本机启动r-nacos服务后，即可请求到对应的控制台后端接口。

r-nacos服务启动方式参考 [r-nacos readme](https://github.com/nacos-group/r-nacos)

### 4. 运行开发工程

在项目目录运行`npm run dev`后即可启动项目测试服务，然后通过`http://localhost:5173/rnacos/`进入控制台。

### 5. Docker 开发方式

#### 通过 Docker 运行开发环境：

1. 复制环境变量文件
```bash
cp .env.example .env
```

2. 修改.env文件中的配置（如需访问宿主机服务，建议设置VITE_PROXY_URL=http://host.docker.internal:10848）

3. 启动 Docker 容器
```bash
docker-compose up
```

4. 访问开发服务
```
http://localhost:5173/rnacos/
```

#### 容器特性：
- 支持热更新（修改代码自动重载）
- 文件双向同步（容器内外修改实时同步）
- 环境变量通过docker-compose.yaml注入

### 6. 开发

使用vscode 或者其它IDE 开始编码开发。

### 7. 代码格式化

提交代码前需要运行 `npm run format` 对代码进行统一的格式化。

### 8. 提交代码

提交代码，并提PR。
