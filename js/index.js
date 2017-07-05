var cookie_status = getCookie();
var close_notice = document.getElementById('close');
var notice = document.getElementById('disappear');
var follow = document.getElementById('follow');
var login = document.getElementById('login');

// cookie中检测是否显示提示条
if (cookie_status.notice_static == undefined) {
    close_notice.addEventListener('click', function(event) {
        setCookie('notice_static', 'off');
        notice.classList.add('off');
    });
} else if (cookie_status.notice_static === "off") {
    notice.classList.add('off');
}


// 检测cookie中follow状态
if (cookie_status.followSuc === 'follow') {
    follow.style.backgroundColor = '#ccc';
    follow.innerText = '已关注';
    follow.setAttribute('disabled', '');
}


// 关闭login页面
document.getElementById('login_close').addEventListener('click', function(event) {
    document.getElementById('login').className += ' off';
});


(function() {
    // 点击关注判断是否登录 弹出登录or设置关注
    follow.addEventListener('click', function(event) {
        if (cookie_status.loginSuc == undefined) {
            login.classList.remove('off');
        } else if (cookie_status.loginSuc == "true") {
            alert('1');
            ajax({
                url: "http://study.163.com/webDev/attention.htm", //请求地址
                type: "get", //请求方式
                data: {}, //请求参数
                success: function(res, xml) {
                    if (res == 1) {
                        setCookie('followSuc', 'follow')
                        console.log(res);
                    } else if (res == 0) {
                        console.log(res);
                    }
                },
                fail: function(status) {
                    console.log('sonething was wrong: ' + status);
                }
            });
            setCookie('followSuc', 'follow');
        }
    });


    var uName = document.getElementById('name-err');
    var uPwd = document.getElementById('pwd-err');
    var input_name = document.getElementById('userName');
    var input_pwd = document.getElementById('password');

    input_name.addEventListener(
        'invalid',
        function(event) {
            var target = event.target;
            if (target.validity.valueMissing) {
                event.preventDefault();
                uName.innerText = '请输入用户名';
            }
        });

    input_pwd.addEventListener(
        'invalid',
        function(event) {
            var target = event.target;
            if (target.validity.valueMissing) {
                event.preventDefault();
                uPwd.innerText = '请输入密码';
            }
        });
})();


var uName = document.getElementById('name-err');
// // 绑定登录事件
var form = document.forms.loginForm;
var uPwd = document.getElementById('pwd-err');
var logBtn = document.getElementById('logBtn');

form.addEventListener('submit', function(event) {
    _login();
});


// 登录
function _login() {
    ajax({
        url: "http://study.163.com/webDev/login.htm",
        type: "get",
        data: {
            userName: "95b9941b277caf1c77ee35fee66fc5f6",
            password: "a972aec008fd064f00ae77c3a6472cc2"
        },

        success: function(res, xml) {
            console.log(res);

        },
        fail: function(status) {
            console.log('someThing was wrong: ' + status);
        }

    });
}

// 获取课程
(function() {
    getClass(1, 20, 10);
})();


//获取hotClass
(function() {
    hotClass();
})();


var lis = document.getElementById('paging').getElementsByTagName('li');
for (var i = 0, len = lis.length; i < len; i++) {
    (function(node, index) {
        node.addEventListener('click', function(event) {
            console.log(index);
            if (index == 0) {
                alert(index);
                getClass(1, 20, 10);
            } else if (index == lis.length - 1) {
                alert(index);
                getClass(lis.length - 2, 20, 10);
            } else {
                alert(index);
                getClass(index, 20, 10);
            }
        });
    })(lis[i], i);
}





















// hotClass();
// var hotClass = function(){} 
function hotClass() {
    ajax({
        url: "http://study.163.com/webDev/hotcouresByCategory.htm", //请求地址
        type: "get", //请求方式
        data: {}, //请求参数
        success: function(res, xml) {
            var resp = JSON.parse(res);
            // console.log(resp);
            var hotClass = document.getElementById('hot-content').getElementsByTagName('ul')[0];
            hotClass.innerHTML = '';
            for (var i = 0; i < resp.length; i++) {
                var hot_li = document.createElement('li');
                hot_li.innerHTML = ' <div class="hot-course">\
                                        <i class="hc-img"><img src="' + resp[i].smallPhotoUrl + '"></i>\
                                        <h3>' + resp[i].name + '</h3>\
                                        <div class="fans-number"><i class="htc-img"></i><span>' + resp[i].learnerCount + '</span></div>\
                                        </div>';
                hotClass.appendChild(hot_li);
            }
        },
        fail: function(status) {
            console.log('someThing was wrong: ' + status);
        }
    });
}

//获取课程 page当前页数 size每页显示个数 type类型 10、20
function getClass(page, size, type) {
    ajax({
        url: "http://study.163.com/webDev/couresByCategory.htm",
        type: "get",
        data: { pageNo: page, psize: size, type: type },
        success: function(res, xml) {
            var resp = JSON.parse(res);

            // 生成课程
            var course = document.getElementById('course');
            course.innerHTML = '';
            for (var i = 0; i < size; i++) {
                var diva = document.createElement('div');
                diva.innerHTML = '  <i class="img"><img src="' + resp.list[i].middlePhotoUrl + '"></i>\
                    <h3>' + resp.list[i].name + '</h3>\
                    <span>' + resp.list[i].provider + '</span>\
                    <div class="fans"><i></i><span>' + resp.list[i].learnerCount + '</span></div>\
                    <div class="price">￥' + resp.list[i].price + '</div>';
                course.appendChild(diva);
                diva.className = 'cell';
            }

        },
        fail: function(status) {
            console.log('someThing was wrong: ' + status);
        }

    });
}

// // 导航关注
// // getNotice();
var getNotice = function(){
    ajax({
        url: "http://study.163.com/webDev/attention.htm", //请求地址
        type: "get", //请求方式
        data: {}, //请求参数
        success: function(res, xml) {
            var resp = JSON.parse(res);
            // console.log(resp);
            return resp;
        },
        fail: function(status) {
            console.log('someThing was wrong: ' + status);
        }
    });
}
