'use strict';


require('../css/login.css');
var $ = require('jquery');
var template = require('artTemplate');

$(function () {

    var data = {
        title: '基本例子',
        isAdmin: true,
        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    var html = template('test', data);
    document.getElementById('content').innerHTML = html;

});

//$(function () {
//    //检查浏览器的版本
//    checkBrowserVersion();
//
//    function checkBrowserVersion() {
//        var browsers = ['ie', 'firefox', 'chrome', 'opera', 'safari'];
//        var ver = insaic.getBrowser;
//        for (var i = 0; i < browsers.length; i++) {
//            if (browsers[i] in ver) {
//                insaic.log('当前浏览器是：' + browsers[i] + '，版本号是：' + ver[browsers[i]]);
//                if (browsers[i] === 'ie') {
//                    var n = new Number(ver[browsers[i]]);
//                    if (n < 8) {
//                        window.location.href = '302.html';
//                    }
//                }
//            }
//        }
//    };
//
//    //登录时回车事件
//    $(document).keyup(function (event) {
//        event.keyCode == 13 && $('#sign_in').click();
//    });
//
//    //用户名称键盘事件
//    inputEvent($('#userCode'), '请输入用户名称&请输入2-20位有效的用户名称', 2);
//    //用户密码键盘事件
//    inputEvent($('#password'), '请输入用户密码&请输入6-12位有效的用户密码', 6);
//
//    /**
//     * 文本框的键盘事件
//     * @param  {[元素]} el       [校验的文本框元素]
//     * @param  {[string]} msgArray [错误信息]
//     * @return {[void]}
//     */
//    function inputEvent(el, msgArray, minLength) {
//        var msg = msgArray.split('&');
//        el.keyup(function (event) {
//            var val = $.trim($(this).val());
//            if (val === '') {
//                $('.error').text(msg[0]);
//            } else {
//                $('.error').text('');
//            }
//        }).blur(function (event) {
//            var val = $.trim($(this).val());
//            var len = val.length;
//            if (val !== '' && (len < minLength)) {
//                $('.error').text(msg[1]);
//            } else {
//                $('.error').text('');
//            }
//        });
//    };
//
//
//    //页面输入框校验值
//    function checkInput() {
//        var $user = $('#userCode'),
//            $pwd = $('#password'),
//            $error = $('.error');
//        if ($.trim($user.val()) === '') {
//            $error.text('请输入用户名称');
//            $user.focus();
//            return false;
//        }
//        if ($.trim($user.val()).length < 2) {
//            $error.text('请输入2-20位有效的用户名称');
//            $user.focus();
//            return false;
//        }
//        if ($.trim($pwd.val()) === '') {
//            $error.text('请输入用户密码');
//            $pwd.focus();
//            return false;
//        }
//        if ($.trim($pwd.val()).length < 6) {
//            $error.text('请输入6-12位有效的用户密码');
//            $pwd.focus();
//            return false;
//        }
//        return true;
//    };
//
//
//    //登录
//    $('#sign_in').click(function () {
//        if (!checkInput()) return;
//        var redirect = insaic.getQueryString('redirect');
//        login(redirect);
//    });
//
//
//    /**
//     * 登录
//     * @return {[string]}      [跳转路径]
//     */
//    function login(redirect) {
//        var $usercode = $.trim($('#userCode').val());
//        var params = {
//            transCode: 'TY1015',
//            request: {
//                userCode: $usercode,
//                password: $('#password').val(),
//                redirect: redirect
//            },
//            callback: function (response, status) {
//                if (status !== insaic.dictionary.s) {
//                    var e_msg = response.errorMessges;
//
//                    if (typeof e_msg === 'object') {
//                        var out_msg = [];
//                        for (var i = 0; i < e_msg.length; i++) {
//                            if ('pwdInvalid' === e_msg[i].message) {
//                                insaic.ui.alert('密码已过期，请点击确认修改密码', function (flag) {
//                                    if (flag) window.location.href = 'user/resetPassword.shtml?usercode=' + $usercode;
//                                });
//                                e_msg[i].message = '密码已过期';
//                            }
//                            out_msg.push(e_msg[i].message);
//                        }
//                        if (out_msg.length > 0) {
//                            return void outputError(out_msg.join(''));
//                        }
//                    } else {
//                        return void outputError(e_msg);
//                    }
//                }
//
//                var result = response.result,
//                    error = result.error,
//                    redirect = result.redirect;
//                if (error != '') {
//                    return void outputError(error);
//                }
//
//                redirect = redirect === '' ? 'default.shtml' : redirect;
//                window.location.href = redirect;
//
//
//            }
//        };
//        insaic.ajax.post(params);
//    };
//
//    /**
//     * 输入错误信息
//     * @param  {[string]} msg [错误信息]
//     * @return {[void]}
//     */
//    function outputError(msg) {
//        $('.error').text(msg);
//        $('#userCode,#password').val('');
//    };
//
//});