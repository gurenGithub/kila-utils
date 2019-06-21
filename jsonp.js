const jsonp = function (url, data, callback) {


    var script = document.createElement('script');
    console.log(url, data);
    //jsonp: "jsonpCallback", //服务端用于接收callback调用的function名的参数

    let callbackName = 'jin10_comments_jsonpCallback' + new Date().getTime();

    window[callbackName] = function (res) {

        if (callback) {
            callback(res);
        }
        script.remove();
    }
    data.jsonpCallback = callbackName;
    var paramas = [];
    for (var key in data) {

        if(data[key]!==''&& data[key]!==null && data[key]!==undefined){
            paramas.push(key + '=' + data[key]);
        }
       
    }

   
    // 指定回调函数的名字为 handleResponse
    script.src = url + (url.indexOf('?') == -1 ? '?' : '&') + paramas.join('&');
    document.body.insertBefore(script, document.body.firstChild);

    //script.remove();
}

export default jsonp;