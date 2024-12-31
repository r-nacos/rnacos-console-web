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
  var list = [];
  var srcLine = 0;
  var dstLine = 0;
  for (var i in diffs) {
    const item = diffs[i];
    if (item.removed) {
      var subItems = splitLines(item.value);
      for (var j in subItems) {
        srcLine += 1;
        var obj = {
          src: subItems[j],
          dst: '',
          srcLine: srcLine,
          dstLine: 0,
          t: 'R'
        };
        list.push(obj);
      }
    } else if (item.added) {
      var subItems = splitLines(item.value);
      for (var j in subItems) {
        dstLine += 1;
        var obj = {
          src: '',
          dst: subItems[j],
          srcLine: 0,
          dstLine: dstLine,
          t: 'A'
        };
        list.push(obj);
      }
    } else {
      var subItems = splitLines(item.value);
      for (var j in subItems) {
        srcLine += 1;
        dstLine += 1;
        var obj = {
          src: subItems[j],
          dst: subItems[j],
          srcLine: dstLine,
          dstLine: dstLine,
          t: '='
        };
        list.push(obj);
      }
    }
  }
  return list;
};

export const buildDiffResult = function (list) {
  var srcNo = '';
  var srcCode = '';
  var dstNo = '';
  var dstCode = '';

  for (var i in list) {
    const item = list[i];
    if (item.t == '=') {
      srcCode += escapeHtml(item['src']) + '\n';
      dstCode += escapeHtml(item['dst']) + '\n';
      srcNo += item['srcLine'] + '   \n';
      dstNo += item['dstLine'] + '   \n';
    } else if (item.t == 'R') {
      srcCode +=
        "<span style='color:#f00'>" + escapeHtml(item['src']) + '</span>\n';
      dstCode += '\n';
      srcNo += "<span style='color:#f00'>" + item['srcLine'] + ' - </span>\n';
      dstNo += '\n';
    } else {
      srcCode += '\n';
      dstCode +=
        "<span style='color:#0ff'>" + escapeHtml(item['dst']) + '</span>\n';
      srcNo += '\n';
      dstNo += "<span style='color:#0ff'>" + item['dstLine'] + ' + </span>\n';
    }
  }
  return {
    srcNo,
    srcCode,
    dstNo,
    dstCode
  };
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
