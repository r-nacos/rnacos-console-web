# PageContainer

## 核心配置参数
```typescript
export interface CrudOptions<T> {
  columns: TableColumn<T>[]
  apis?: {
    create?: string
    update?: string
    delete?: string
    list?: string
  }
  pagination?: AnyObj | undefined
  form?: {
    title?: string
  }
  param?: {}
  drawer?: {
    width?: number | string | undefined
  }
  validator?: Function
}
```
### columns
  > 表格配置参数  `请参阅nav-ui表格参数`
### apis
  > api 请求路径参数, 主要传入 
  > `create` 新增
  > `update` 修改
  > `delete` 删除
  > `list` 列表
### pagination
  > 分页参数 `请参阅nav-ui分页配置`
### form
  > 表单配置参数 `表单配置项`
### param
  > 请求条件参数 `主要用来设置条件过滤请求`
### drawer
  > 抽屉配置参数
### validator
  > 表单验证参数公共方法

## 组件内部封装
### header 插槽
  > 主要用来装载头部内容
### actions 插槽
  > 主要用来装载辅助列表及功能相关的搜索条件和按钮
### form 表单插槽
  > 主要用来表单项进行数据交互
### footer 抽屉底部插槽
  > 主要用来进行二次自定义抽屉底部内容，灵活配置