import * as path from 'node:path'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import { useDateFormat } from '@vueuse/core'
import attributeExtension from 'vite-plugin-vue-attribute-extension'
import proxy from './proxy'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const buildTime = useDateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss SSS')
  const isProd: boolean = command === 'build' && mode === 'production'
  const runtime = {
    env,
    isProd,
    buildTime: buildTime.value,
  }
  console.log('runtime =>', runtime)
  return {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/style/_variable.scss";',
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      attributeExtension(),
      Components({
        resolvers: [NaiveUiResolver()],
        directoryAsNamespace: true,
        dts: './temp/auto-components.d.ts',
      }),
      createHtmlPlugin({
        minify: true,
        pages: [
          {
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: {
                title: 'rnacos-console',
                injectScript: ``,
                pubId: 9527,
              },
            },
          },
        ],
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
          {
            axios: [['default', 'axios']],
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar', 'useModal', 'useModalProvider'],
          },
        ],
        eslintrc: {
          enabled: false,
          filepath: './temp/.eslintrc-auto-import.json', // eslint继承这里进行语法检查
          globalsPropValue: true,
        },
        dts: './temp/auto-imports.d.ts',
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: '[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
        '@views': path.resolve(__dirname, './src/views/'),
      },
    },
    base: env.VITE_APP_BASE_DIR,
    server: {
      proxy: proxy(env),
      port: env.VITE_APP_PORT as unknown as number,
      host: '0.0.0.0',
    },
    preview: {
      proxy: proxy(env),
      cors: true,
    },
    define: {
      Runtime: JSON.stringify(runtime),
    },
    build: {
      target: 'esnext',
      sourcemap: !isProd,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
        },
      },
    },
  }
}
