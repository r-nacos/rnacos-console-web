# 开发代理指南

## 构建和测试命令

- `npm run dev` - 启动开发服务器 (http://localhost:5173/rnacos/)
- `npm run build` - 构建生产版本 (包含 vue-tsc 类型检查)
- `npm run lint` - ESLint 代码检查和自动修复
- `npm run format` 或 `npm run fmt` - Prettier 代码格式化
- `npm run preview` - 预览构建后的应用

## 代码风格指南

### 导入规范

- 使用绝对路径：`@/` 指向 `src/`，`/#/` 指向 `src/types/`
- 先导入第三方库，再导入本地模块
- Vue 相关使用自动导入 (unplugin-auto-import)

### 命名约定

- 组件：PascalCase (ConfigPage.vue, UserList.vue)
- 文件：kebab-case 或 camelCase (config.ts, user-detail.vue)
- 变量/函数：camelCase (getUserList, configData)
- 常量：UPPER_SNAKE_CASE (API_BASE_URL)
- 接口：以 I 开头 (IConfig, IUser)

### 类型安全

- 严格启用 TypeScript (strict: true)
- 所有 API 调用使用接口定义
- 使用 Naive UI 组件库，自动导入

### 格式化

- Prettier: 2 空格缩进，单引号，80 字符行宽
- 分号结尾，无尾随逗号
- ESLint + Vue3 规则，自动修复

### 组件结构

- Composition API 优先
- 使用 .vue 单文件组件
- JSX 组件使用 .tsx/.jsx 扩展名
- 样式使用 Tailwind CSS

### 错误处理

- API 调用统一使用 request 工具
- IApiResult 包装所有 API 响应
