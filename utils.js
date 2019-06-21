
/**
 * 加载css
 * @param { String } url css链接
 */
export const addCss = (url) => {
  return new Promise((resolve) => {
    const node = document.createElement('link')
    node.rel = 'stylesheet'
    node.type = 'text/css'
    node.href = url
    node.onload = function () {
      resolve()
    }
    document.getElementsByTagName('head')[0].appendChild(node)
  })
}

function dynamicLoadJs(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  if (typeof (callback) == 'function') {
      script.onload = script.onreadystatechange = function () {
          if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
              callback();
              script.onload = script.onreadystatechange = null;
          }
      };
  }
  head.appendChild(script);
}

function dynamicLoadCss(url) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  head.appendChild(link);
}

function stopBubble(e) {

  // 如果提供了事件对象，则这是一个非IE浏览器

  e = e || window.event;
  if (e && e.stopPropagation) {

      // 因此它支持W3C的stopPropagation()方法 

      e.stopPropagation();

  } else {

      // 否则，我们需要使用IE的方式来取消事件冒泡

      window.event.cancelBubble = true;

  }

}
/**
 * 加载script
 * 依赖$script
 * https://github.com/ded/script.js/
 * @param { String, Array } url script的url
 * @param { Function } cb 加载成功回调
 */
export const addScript = (url, cb) => {
  dynamicLoadJs(url, cb)
 
}

export const dateFormat = (date, format) => {
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
  }
  if (typeof date === 'number') {
    if (date.toString().length === 10) {
      date *= 1000
    }
  }
  date = new Date(date)
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1,
    (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}


export function  getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

export function normalizeServerTime (time) {
  if (typeof time === 'string') {
    return time.replace(' ', 'T') + '+08:00'
  }
  return time
}

export const cookie = {
  set (sName, sValue, sExpires, spath, sdomain, secure) {
    let sCookie = sName + '=' + encodeURIComponent(sValue)
    let date = new Date()
    date.setTime(date.getTime() + 3600 * 24 * 1000 * 365)
    sExpires = sExpires || date.toGMTString()
    if (sExpires != null) sCookie += '; expires=' + sExpires
    if (spath != null) sCookie += '; path=' + spath
    if (sdomain != null) sCookie += '; domain=' + sdomain
    if (secure != null) sCookie += '; secure=' + secure
    document.cookie = sCookie
  },
  get (sName) {
    let aCookie = document.cookie.split('; ')
    for (var i = 0; i < aCookie.length; i++) {
      var aCrumb = aCookie[i].split('=')
      if (sName === aCrumb[0]) return decodeURIComponent(aCrumb[1])
    }
    return ''
  },
  remove (sName, spath, sdomain) {
    if (this.get(sName)) {
      document.cookie = sName + '=' +
        ((spath) ? ';path=' + spath : '') +
        ((sdomain) ? ';domain=' + sdomain : '') +
        ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
  }
}
