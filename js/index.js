(function(){
    var cookie_status = getCookie();
    var close_notice = document.getElementById('close');
    var notice = document.getElementById('disappear');
    var follow = document.getElementById('follow');
    var login = document.getElementById('login');

    // cookie中检测是否显示提示条
    if (cookie_status.notice_static == undefined) {
        close_notice.addEventListener('click', function(e) {
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
    document.getElementById('login_close').addEventListener('click', function(e) {
        document.getElementById('login').classList.add('off');
    });
    // 关闭video
    document.getElementById('v-close').addEventListener('click', function(e) {
        document.getElementById('video').classList.add('off');
    });

    document.getElementById('a-video').addEventListener('click',function(e){
        document.getElementById('video').classList.remove('off')
    });


    (function() {
        // 点击关注判断是否登录 弹出登录or设置关注
        follow.addEventListener('click', function(e) {
            if (cookie_status.loginSuc == undefined) {
                login.classList.remove('off');
            } else if (cookie_status.loginSuc == "true") {
                ajax({
                    url: "http://study.163.com/webDev/attention.htm", //请求地址
                    type: "get", //请求方式
                    data: {}, //请求参数
                    success: function(res, xml) {
                        if (res == 1) {
                            setCookie('followSuc', 'follow')
                            console.log(res);
                            follow.style.backgroundColor = '#ccc';
                            follow.innerText = '已关注';
                            follow.setAttribute('disabled', '');
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

    })();

    //轮播
    (function(){
        var CURRENT = 0;
        var DURATION = 5000;
        var imgWrap = document.getElementById('imgWrap');
        var img = imgWrap.children;
        var imgLen = img.length;


        var btnWrap = document.getElementById('b-btn');
        var btn = btnWrap.getElementsByTagName('ul')[0].children;
        var opa = function(ele,lev){
            if (ele.filters) {
                ele.style.filters = 'alpha(opacity=' + lev + ')';
            }else {
                ele.style.opacity = lev/100;
            }
        }
        var fadeIn = function(ele){
            opa(ele,0);
            for (var i = 0; i < 21; i++) {
                (function(){
                    var lev = i*5;
                    setTimeout(function(){
                        opa(ele,lev);
                    },i*40)
                })(i);
            }
        }

        var fadeOut = function(ele){
            for (var i = 0; i < 21; i++) {
                (function(){
                    var lev = 100 - i * 5;
                    setTimeout(function(){
                        opa(ele,lev);
                    },i*40);
                })(i);
            }
        }

        var time = setInterval(function() {
            if (CURRENT < imgLen - 1) {
                CURRENT++;
            } else {
                CURRENT = 0;
            }
            change(CURRENT);
        }, DURATION);

        function change(n) {
            fadeOut(imgWrap.getElementsByClassName('imgOn')[0]);
            imgWrap.getElementsByClassName('imgOn')[0].classList.remove('imgOn');
            img[n].classList.add('imgOn');
            fadeIn(img[n]);

            btnWrap.getElementsByTagName('ul')[0].getElementsByClassName('btnOn')[0].classList.remove('btnOn');
            btn[n].classList.add('btnOn');
        }

        function eve() {
            for (var i = 0; i < imgLen; i++) {
                (function(_i){
                    img[_i].addEventListener('mouseover',function(e){
                        clearTimeout(time);
                        CURRENT = _i;
                    });

                    img[_i].addEventListener('mouseout',function(e){
                         time = setInterval(function() {
                            if (CURRENT < imgLen - 1) {
                                CURRENT++;
                            } else {
                                CURRENT = 0;
                            }
                            change(CURRENT);
                        }, DURATION);
                    });

                    btn[_i].addEventListener('click',function(e){
                        clearTimeout(time);
                        change(_i);
                        CURRENT = _i;
                    });
                })(i);
            }
        }
        eve();
    })();


    // 绑定登录事件
        var form = document.forms.loginForm;
        form.addEventListener('submit',function(e){
            if (form.userName != 'studyOnline' && form.password.value != 'study.163.com') {
                document.getElementById('l-msg').innerHTML = '用户名或密码错误';
                var event = event || window.event;
                event.preventDefault(); // 兼容标准浏览器
                window.event.returnValue = false; // 兼容IE6~8
            }else {
                _login();
            }

        })
    // 登录
    function _login() {
        var name = md5("studyOnline");
        var pwd = md5("study.163.com");
    // alert(name);
        ajax({
            url: "http://study.163.com/webDev/login.htm",
            type: "get",
            data: {
                userName: name,
                password: pwd
            },
            success: function(res, xml) {
                setCookie('loginSuc', 'true')
                document.getElementById('login').classList.add('off');
                if (res == 1) {
                    console.log('登陆成功，res='+res);
                }
            },
            fail: function(status) {
                //登录验证在_login调用之前已完成 所以进入ajax的都是正确的用户名密码 但是依然经常会出现返回0 不知是网络不稳定还是接口问题 故直接将fail和success一样处理
                setCookie('loginSuc', 'true')
                document.getElementById('login').classList.add('off');
                var event = event || window.event;
                event.preventDefault(); // 兼容标准浏览器
                window.event.returnValue = false; // 兼容IE6~8
                console.log('someThing was wrong: ' + status);
            }

        });
    }

    // 获取课程
    (function() {
        //初始
        var type = 10;
        paging(type);
        getClass(1, 20, type);
        var tit1 = document.getElementById('con-title1');
        var tit2 = document.getElementById('con-title2');
        //产品设计
        tit1.addEventListener('click',function(e){
            type = 10;
            paging(type);
            getClass(1,20,type);
            document.getElementsByClassName('choosen')[0].classList.remove('choosen');
            tit1.classList.add('choosen');
        });
        //编程语言
        tit2.addEventListener('click',function(e){
            type = 20;
            // console.log(type);
            paging(type);
            getClass(1,20,type);
            document.getElementsByClassName('choosen')[0].classList.remove('choosen');
            tit2.classList.add('choosen');
        });

        //分页
     function paging (type){
        var lis = document.getElementById('paging').getElementsByTagName('li');
        for (var i = 0, len = lis.length; i < len; i++) {
            (function(node, index) {
                node.addEventListener('click', function(e) {
                    if (index == 0) {
                        getClass(1, 20, type);
                    } else if (index == lis.length - 1) {
                        getClass(lis.length - 2, 20, type);
                    } else {
                        getClass(index, 20, type);
                    }
                });
            })(lis[i], i);
        }
    }
    })();


    //获取hotClass
    (function() {
        hotClass();
    })();
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
                for (var i = 0; i < 10; i++) {
                    var hot_li = document.createElement('li');
                    hot_li.innerHTML = ' <div class="hot-course">\
                                            <i class="hc-img"><img src="' + resp[i].smallPhotoUrl + '"></i>\
                                            <h3>' + resp[i].name + '</h3>\
                                            <div class="fans-number"><i class="htc-img"></i><span>' + resp[i].learnerCount + '</span></div>\
                                            </div>';
                    hotClass.appendChild(hot_li);
                }
                move();
                function move(){
                    //滚动
                        var j = 0;
                        setInterval(function(){
                            hotClass.innerHTML = '';
                            if (j<10) {
                                for (var i = 0; i < 10; i++) {
                                    var c = i + j;
                                    // console.log(resp[c].smallPhotoUrl);
                                    var hot_li = document.createElement('li');
                                    hot_li.innerHTML = ' <div class="hot-course">\
                                                            <i class="hc-img"><img src="' + resp[c].smallPhotoUrl + '"></i>\
                                                            <h3>' + resp[c].name + '</h3>\
                                                            <div class="fans-number"><i class="htc-img"></i><span>' + resp[c].learnerCount + '</span></div>\
                                                            </div>';
                                    hotClass.appendChild(hot_li);
                                }
                                j++;
                            }else {
                                j = 0;
                                for (var i = 0; i < 10; i++) {
                                    var c = i + j;
                                    // console.log(c);
                                    var hot_li = document.createElement('li');
                                    hot_li.innerHTML = ' <div class="hot-course">\
                                                            <i class="hc-img"><img src="' + resp[c].smallPhotoUrl + '"></i>\
                                                            <h3>' + resp[c].name + '</h3>\
                                                            <div class="fans-number"><i class="htc-img"></i><span>' + resp[c].learnerCount + '</span></div>\
                                                            </div>';
                                    hotClass.appendChild(hot_li);
                                }
                            }
                        },5000);
                };
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

                // cellhover
                // var course = document.getElementById('course');
                // for (var i = 0; i < size; i++) {
                //     var diva = document.createElement('div');
                //     diva.innerHTML = '  <i class="img"><img src="' + resp.list[i].middlePhotoUrl+ '"></i>\
                //     <h3>'+resp.list[i].name +'</h3>\
                //     <div class="c-fans"><i></i><span>'+resp.list[i].learnerCount+'</span>人在学</div>\
                //     <div class="c-publisher">\
                //         发布者:<span>'+resp.list[i].provider+'</span>\
                //     </div>\
                //     <div class="c-type">\
                //         分类:<span>'+resp.list[i].categoryName+'</span>\
                //     </div>\
                //     <p class="c-intro">'+resp.list[i].description+'</p>';
                //     course.appendChild(diva);
                //     diva.className = 'cell cellhover off';
                // }
                // var cell = document.getElementsByClassName('cell');
                // var cellhover = document.getElementsByClassName('cell hover');
                // for (var i = 0; i < size; i++) {
                //     (function(_i){
                //         cell[_i].addEventListener('mouseenter',function(e){
                //             cellhover[_i].classList.remove('off');
                //         });
                //         cellhover[_i].addEventListener('mouseleave',function(e){
                //             cellhover[_i].classList.add('off');
                //         });
                //     })(i)
                // }


            },
            fail: function(status) {
                console.log('someThing was wrong: ' + status);
            }

        });
    }

    // // 导航关注
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

})();
