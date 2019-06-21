const trim = ''.trim
  ? (s) => { return s.trim(); }
  : (s) => { return s.replace(/(^\s*|\s*$)/g, ''); }

const parseHeader = (str) => {
  let lines = str.split(/\r?\n/);
  let fields = {};
  let index = null
  let line = null
  let field = null
  let val = null
  let i = 0

  lines.pop();
  
  let len = lines.length
  for (i = 0; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

const ajax = (options) => {
    if (!options.url ||
        !(options.success || options.error || options.complete)) {
        return;
    }
    const state = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    }
    const noop = function () {}
    const method = (options.method || '').toUpperCase()
    const headers = options.headers
    const onHeaders = options.onHeaders || noop
    const errorFn = options.error || noop
    const successFn = options.success || noop
    const completeFn = options.complete || noop
    const timeoutFn = options.timeoutCallback || noop
    const url = options.url
    const timeout = options.timeout || 30000

    let addContentHeader = method === 'POST'
    let timer

    // ie9下如果用cors的话就需要使用XDomainRequest
    if (options.withCredentials && window.XDomainRequest) {
        let data = options.data
        if (data instanceof Object) {
            data = JSON.stringify(data);
        }

        const XDR = new XDomainRequest();
        XDR.open(method, url);
        XDR.timeout = timeout;
        XDR.onload = () => {
            try {
                const response = XDR.responseText
                successFn(response);
            } catch (e) {
                errorFn(e)
            }
            completeFn()
        };
        XDR.onprogress = () => {};
        XDR.ontimeout = () => {
            timeoutCallback()
            console.log('XDomainRequest timeout')
        };
        XDR.onerror = (e) => {
            errorFn(e)
            console.log('XDomainRequest error')
        };
        setTimeout(() => {
            XDR.send(data);
        }, 0);
        return false
    }
    const xhr = new XMLHttpRequest()

    xhr.open(method || 'GET', url, true);
    // 添加readystatechange
    xhr.onreadystatechange = function() {
        if (xhr.readyState === state.HEADERS_RECEIVED) {
            onHeaders(xhr.statusText, parseHeader(xhr.getAllResponseHeaders()))
        } else if (xhr.readyState === state.DONE) {
            clearTimeout(timer);
            // 检查错误
            if (xhr.status < 200 || xhr.status > 299) {
                errorFn(xhr.statusText);
            } else {
                successFn(xhr.responseText);
            }
            completeFn(xhr.statusText);
        }
    };

    // 添加headers
    if (headers) {
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
            if (key.toLowerCase() === 'content-type') {
                addContentHeader = false;
            }
        }
    }
    if (addContentHeader) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    // 超时
    if (timeout) {
        timer = setTimeout(function() {
            xhr.abort();
            clearTimeout(timer);
        }, timeout);
    }

    // 设置withCredentials
    if (options.hasOwnProperty("withCredentials")) {
        xhr.withCredentials = options.withCredentials;
    } else {
        xhr.withCredentials = true;
    }

    xhr.send(options.data);

    return xhr;
}
export default ajax
