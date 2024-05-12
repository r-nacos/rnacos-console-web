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
    placement?: string
    showMask: boolean
  }
  validator?: Function
}
```
### columns
  > 表格配置参数  `请参阅nav-ui表格参数`
### apis
  > api 请求路径参数, 主要传入 

|  名称   | 类型  | 默认值 | 说明 |
| - | - | - | - |
| create | string | 无 | 非必传，新增api地址 |
| update | string | 无 | 非必传，需改api地址 |
| delete | string | 无 | 非必传，删除api地址 |
| list | string | 无 | 非必传，列表api地址 |

### pagination
  > 分页参数 `请参阅nav-ui分页配置`

|  名称   | 类型  | 默认值 | 说明 |
| - | - | - | - |
| pagination | object | 无 | 非必传，需要分页请设置 |

### form
  > 表单配置参数 `表单配置项`

|  名称   | 类型  | 默认值 | 说明 |
| - | - | - | - |

| title | string | 无 | 非必传，设置表单标题 |

### param
  > 请求条件参数 `主要用来设置条件过滤请求`

|  名称   | 类型  | 默认值 | 说明 |
| - | - | - | - |
| param | object | 无 | 非必传，有条件搜索过滤时请设置此字段且在插槽actions中添加对应的搜索表单 |


### drawer
> 抽屉配置参数

|  名称   | 类型  | 默认值 | 说明 |
| - | - | - | - |
|  width | number \| string \| undefined | 600 | 抽屉宽度 |
|  placement | top \| right \| bottom \| left | right | 抽屉显示位置 |
|  showMask | boolean | true | 显示遮罩 |
  
### validator
  > 表单验证参数公共方法

## 插槽
| 插槽名称 | 说明 |
| - | - |
| header | 显示界面导航信息 |
| actions | 主要用来装载辅助列表及功能相关的搜索条件和按钮 |
| form | 表单插槽 |
| footer | 主要用来扩展抽屉底部自定义 |
| custom | 自定义插槽，自定义表单及界面装载，不受抽屉的样式控制 |