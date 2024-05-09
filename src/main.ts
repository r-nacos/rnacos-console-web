import { createApp } from 'vue'
import App from './App.vue'
import './logger'
import router from './router'
import { directive } from '@/directive/index'
import PageContainer from './components/common/PageContainer.vue'
import NamespacePopSelect from '@/components/namespace/NamespacePopSelect.vue'
// import 'animate.css'
import './assets/style/index.scss'

// 注册svg
import 'virtual:svg-icons-register'
const app = createApp(App)

// 自定义指令
directive(app)

// 注册全局组件
app.component('PageContainer', PageContainer)
app.component('NamespacePopSelect', NamespacePopSelect)

// 创建路由
router(app)
