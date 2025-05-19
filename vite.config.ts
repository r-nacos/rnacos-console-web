import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const root = process.cwd();

  function pathResolve(dir: string) {
    return resolve(root, '.', dir);
  }

  const env = loadEnv(mode, root)
  return {
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist('>=0.25%')),
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      tailwindcss(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
    ],
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
      ]
    },
    build: {
      cssMinify: 'lightningcss',
      assetsDir: 'rnacos/assets',
      //    需要与actions配合，暂时不能直接改
      //    outDir: 'dist-wrap/src/dist',
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT) || 5173,
      proxy: {
        '/rnacos/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true
        }
      },
      base: env.VITE_BASE_URL
    }
  }
})
