
export const escapeHtml = function(html) {
  return html.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}