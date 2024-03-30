export default (env: Record<string, string>) => {
  return {
    '/nacos': {
      changeOrigin: true,
      target: env.VITE_APP_API_HOST,
    },
  }
}
