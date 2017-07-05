// 添加cookie
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 获取 cookie
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}


// ajax
function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if ((status >= 200 && status < 300) || status == 304) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
                alert(status);
            }
        }
    }

    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}



// ajax({
//         url: "./TestXHR.aspx",              //请求地址
//         type: "POST",                       //请求方式
//         data: { name: "super", age: 20 },        //请求参数
//         dataType: "json",
//         success: function (response, xml) {
//             // 此处放成功后执行的代码
//           },
//           fail: function (status) {
//             // 此处放失败后执行的代码
//           }
//         });



function get (url,options,callback) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest(): new ActiveObject("Microsoft.XMLHTTP");
  xhr.onreadystatechange = function  (callback) {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        callback(xhr.responseText);
      }else {
        alert('request was unsuccessful:' + xhr.status)
      }
    }
  }
  xhr.open('get',url+'?'+serialize(options),true);
  xhr.send(null);
}
function serialize(data){
  if (!data) {return ''};
  var pairs = [];
  for (var name in data) {
    if (!data.hasOwnProperty(name)) {continue;}
    if (typeof data[name] === 'function') {continue;}
    var value = data[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}
