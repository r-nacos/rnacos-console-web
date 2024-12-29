import { createI18n } from 'vue-i18n';
import zh from './lang/zh-CN';
import en from './lang/en-US';

const messages = {
  zh,
  en
};
const language = (navigator.language || 'en').toLocaleLowerCase(); // 这是获取浏览器的语言
const locale = localStorage.getItem('lang') || language.split('-')[0] || 'en'; // 首先从缓存里拿，没有的话就用浏览器语言，
const i18n = createI18n({
  locale,
  fallbackLocale: 'zh', // 设置备用语言
  messages
});

/**
 * 根据key获取对应语言的message
 * key='common.query' =>  message['common']['query']
 * @param key
 * @returns {*|string}
 */
export const getMessage = function (key) {
  var obj = messages[locale] || en;
  var items = key.split('.');
  for (var subKey of items) {
    obj = obj[subKey];
  }
  return obj || '';
};

export default i18n;
