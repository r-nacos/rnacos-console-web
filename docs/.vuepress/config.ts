import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'


export default defineUserConfig({
  title: 'r-naocs',
  description: "『r-nacos是一个用rust实现的nacos服务』",
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar: [
        {
            text: "首页",
            link: "/home/",
        },
        {
            text: "常见问题",
            link: "/question/",
        },
        {
          text: "更新日志",
          link: "/logs/",
      }
    ]
  }),
})
