import { diffLines } from 'diff';
import tjs from 'template_js';

export const escapeHtml = function (html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

export const splitLines = (value) => {
  var subItems = value.split('\n');
  if (subItems[subItems.length - 1] === '') {
    subItems.pop();
  }
  return subItems;
};

export const handleDiff = function (src, dst) {
  const diffs = diffLines(src, dst);
  const list = [];
  let srcLine = 0;
  let dstLine = 0;

  for (const item of diffs) {
    const subItems = splitLines(item.value);

    if (item.removed) {
      for (const line of subItems) {
        srcLine += 1;
        list.push({
          src: line,
          dst: '',
          srcLine,
          dstLine: 0,
          t: 'R'
        });
      }
    } else if (item.added) {
      for (const line of subItems) {
        dstLine += 1;
        list.push({
          src: '',
          dst: line,
          srcLine: 0,
          dstLine,
          t: 'A'
        });
      }
    } else {
      for (const line of subItems) {
        srcLine += 1;
        dstLine += 1;
        list.push({
          src: line,
          dst: line,
          srcLine,
          dstLine,
          t: '='
        });
      }
    }
  }
  return list;
};

export const buildDiffResult = function (list) {
  let srcNo = '';
  let srcCode = '';
  let dstNo = '';
  let dstCode = '';

  for (const item of list) {
    const escapedSrc = escapeHtml(item.src);
    const escapedDst = escapeHtml(item.dst);

    if (item.t === '=') {
      srcCode += `<span class="unchanged">${escapedSrc}</span>\n`;
      dstCode += `<span class="unchanged">${escapedDst}</span>\n`;
      srcNo += `<span class="line-number">${item.srcLine}</span>\n`;
      dstNo += `<span class="line-number">${item.dstLine}</span>\n`;
    } else if (item.t === 'R') {
      srcCode += `<span class="removed">${escapedSrc}</span>\n`;
      dstCode += '\n';
      srcNo += `<span class="removed-line">${item.srcLine} -</span>\n`;
      dstNo += '\n';
    } else {
      srcCode += '\n';
      dstCode += `<span class="added">${escapedDst}</span>\n`;
      srcNo += '\n';
      dstNo += `<span class="added-line">${item.dstLine} +</span>\n`;
    }
  }

  return { srcNo, srcCode, dstNo, dstCode };
};

export const copyText = function (text) {
  if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text);
  } else {
    // 创建临时输入框
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    textarea.value = text;
    textarea.select();
    // 复制
    document.execCommand('copy', true);
    // 移除输入框
    document.body.removeChild(textarea);
  }
};

export const template = function (t, obj) {
  return tjs(t, obj);
};

export const arrayCount = function (array) {
  if (!array) {
    return 0;
  }
  return array.length;
};
