// Monaco 编辑器配置
export const getMonacoWorkerUrl = (label: string) => {
  const baseUrl =
    import.meta.env.VITE_MONACO_CDN_URL ||
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs';
  if (label === 'json') {
    return `${baseUrl}/language/json/json.worker.js`;
  }
  if (label === 'css' || label === 'scss' || label === 'less') {
    return `${baseUrl}/language/css/css.worker.js`;
  }
  if (label === 'html' || label === 'handlebars' || label === 'razor') {
    return `${baseUrl}/language/html/html.worker.js`;
  }
  if (label === 'typescript' || label === 'javascript') {
    return `${baseUrl}/language/typescript/ts.worker.js`;
  }
  return `${baseUrl}/editor/editor.worker.js`;
};
