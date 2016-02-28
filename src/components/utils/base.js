/**
 *
 * @authors wangmin (you@example.org)
 * @date    2015-08-18 09:42:19
 * @version Ver 1.0.0
 */
/**
 * JSON
 * 由于IE低版本不支持JSON.stringify和JSON.parse方法，所以重写了JSON方法
 * JSON.stringify对应$.toJSON
 * JSON.parse对应$.evalJSON
 * IE标准的文本模式，是支持JSON.stringify和JSON.parse方法
 */
! function($) {
    'use strict';

    var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        hasOwn = Object.prototype.hasOwnProperty;

    /**
     * jQuery.toJSON
     * Converts the given argument into a JSON representation.
     *
     * @param o {Mixed} The json-serializable *thing* to be converted
     *
     * If an object has a toJSON prototype, that will be used to get the representation.
     * Non-integer/string keys are skipped in the object, as are keys that point to a
     * function.
     *
     */
    $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function(o) {
        if (o === null) {
            return 'null';
        }

        var pairs, k, name, val,
            type = $.type(o);

        if (type === 'undefined') {
            return undefined;
        }

        // Also covers instantiated Number and Boolean objects,
        // which are typeof 'object' but thanks to $.type, we
        // catch them here. I don't know whether it is right
        // or wrong that instantiated primitives are not
        // exported to JSON as an {"object":..}.
        // We choose this path because that's what the browsers did.
        if (type === 'number' || type === 'boolean') {
            return String(o);
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (typeof o.toJSON === 'function') {
            return $.toJSON(o.toJSON());
        }
        if (type === 'date') {
            var month = o.getUTCMonth() + 1,
                day = o.getUTCDate(),
                year = o.getUTCFullYear(),
                hours = o.getUTCHours(),
                minutes = o.getUTCMinutes(),
                seconds = o.getUTCSeconds(),
                milli = o.getUTCMilliseconds();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if (milli < 100) {
                milli = '0' + milli;
            }
            if (milli < 10) {
                milli = '0' + milli;
            }
            return '"' + year + '-' + month + '-' + day + 'T' +
                hours + ':' + minutes + ':' + seconds +
                '.' + milli + 'Z"';
        }

        pairs = [];

        if ($.isArray(o)) {
            for (k = 0; k < o.length; k++) {
                pairs.push($.toJSON(o[k]) || 'null');
            }
            return '[' + pairs.join(',') + ']';
        }

        // Any other object (plain object, RegExp, ..)
        // Need to do typeof instead of $.type, because we also
        // want to catch non-plain objects.
        if (typeof o === 'object') {
            for (k in o) {
                // Only include own properties,
                // Filter out inherited prototypes
                if (hasOwn.call(o, k)) {
                    // Keys must be numerical or string. Skip others
                    type = typeof k;
                    if (type === 'number') {
                        name = '"' + k + '"';
                    } else if (type === 'string') {
                        name = $.quoteString(k);
                    } else {
                        continue;
                    }
                    type = typeof o[k];

                    // Invalid values like these return undefined
                    // from toJSON, however those object members
                    // shouldn't be included in the JSON string at all.
                    if (type !== 'function' && type !== 'undefined') {
                        val = $.toJSON(o[k]);
                        pairs.push(name + ':' + val);
                    }
                }
            }
            return '{' + pairs.join(',') + '}';
        }
    };

    /**
     * jQuery.evalJSON
     * Evaluates a given json string.
     *
     * @param str {String}
     */
    $.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
        /*jshint evil: true */
        return eval('(' + str + ')');
    };

    /**
     * jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     *
     * @param str {String}
     */
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(str) {
        var filtered =
            str
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, '');

        if (/^[\],:{}\s]*$/.test(filtered)) {
            /*jshint evil: true */
            return eval('(' + str + ')');
        }
        throw new SyntaxError('Error parsing JSON, source is not valid.');
    };

    /**
     * jQuery.quoteString
     * Returns a string-repr of a string, escaping quotes intelligently.
     * Mostly a support function for toJSON.
     * Examples:
     * >>> jQuery.quoteString('apple')
     * "apple"
     *
     * >>> jQuery.quoteString('"Where are we going?", she asked.')
     * "\"Where are we going?\", she asked."
     */
    $.quoteString = function(str) {
        if (str.match(escape)) {
            return '"' + str.replace(escape, function(a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + str + '"';
    };

}(window.jQuery);


var insaic = insaic || {
    version: "1.0.0",
    coreFileName: "jquery-1.8.3.min.js",
    namespace: "insaic"
};


/**
 * 核心方法
 * 公有方法
 * 公有工具方法
 */
! function() {
    "use strict";
    var me = this;

    /**
     * 打印日志
     * @param msg 消息
     */
    this.log = function(msg) {
        if (window.console) {
            console.log(msg);
        }
    };

    /**
     * 定义常量对象
     */
    this.dictionary = {
        s: 'success',
        e: 'error',
        f: 'fail',
        t: 'ACCESS_TOKEN'
    };

    //影像路径
    this.additionalPath = {
        filePath: "/getZoomImage?fileName=/nfs/upload/dealer-web", //配置路径
        deleteFilePath: "/nfs/upload/dealer-web" //修改页面删除img的路径
    };


    //投保状态
    this.insuredMode = {
        standard: 'STANDARD', //标准版
        pilot: 'PILOT' //试点版
    }

    /**
     * 响应状态
     */
    this.status = {
        STATUS_SUCCESS: "100", //返回结果正常
        STATUS_ERROR: "999" //返回结果异常：有异常出现的时候为该状态
    };

    /**
     * ajax请求地址
     * @return {[type]} [description]
     */
    this.actionPath = function() {
        return window.location.protocol + "//" + window.location.host + "/controller/access";
    }();


    /**
     * 定义ajax方法
     */
    this.ajax = function() {
        var ajaxCount = 0;
        var _getPostOptions = function(notShowLoading) {
            return {
                async: true,
                beforeSend: function(XHR) {
                    if (window.insaic && window.insaic.ui) {
                        if (!notShowLoading) {
                            insaic.ui.loading().open();
                        }
                    }
                },
                complete: function(xhr, status) {},
                //contentType: "application/x-www-form-urlencoded",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: "",
                //accepts: "application/json",
                error: function(xhr, errorType, error) {},
                global: true,
                success: function(data) {},
                timeout: 60000, //60秒超时
                cache: false,
                type: "POST",
                url: ""
            };
        };

        return {
            /**
             * @示例
             e.ajax.post({},{request:{}});
             */
            post: function(params) {
                var c = ++ajaxCount;
                var dp = params;
                //本地文件直接浏览不发起ajax请求
                if (me.actionPath.indexOf("file://") === 0) {
                    dp.callback({
                        errorMessges: '本地浏览，不作数据交互处理'
                    }, me.dictionary.f);
                    return;
                }

                //不显示加载框
                var notShowLoading = typeof dp.showLoading === "boolean" && !dp.showLoading;
                //忽略的错误集合
                var ignoreError = dp.ignoreError || {};

                var requestJSON = {
                    requestBodyJson: dp.request,
                    transCode: dp.transCode
                };

                var requestString = $.toJSON(requestJSON);
                //me.log("【第" + c + "次ajax请求，请求参数(未替换'null'):】formdata:" + requestString);
                //在IE8.0.6001.18372以及以下的的版本上JSON.stringify()时，会把''转成'null'
                //把JSON格式的字符串中，将'null'再转成''
                requestString = requestString.replace(new RegExp("\'null\'", "gm"), '\"\"');
                requestString = requestString.replace(new RegExp("\"null\"", "gm"), '\"\"');
                me.log("【第" + c + "次ajax请求，请求参数:】formdata:" + requestString);
                var options = {
                    url: dp.url || me.actionPath,
                    data: requestString,
                    success: function(data) {
                        me.log("【第" + c + "次ajax请求完成，进入success函数，其返回值为:】data:" + $.toJSON(data));
                        if (window.insaic && window.insaic.ui) {
                            if (!notShowLoading) {
                                insaic.ui.loading().close();
                            }
                        }
                        //如果服务端没有返回值
                        if (data == null) return;
                        //正常返回
                        if (data.status === me.status.STATUS_SUCCESS) {
                            //请求成功 返回结果正常
                            if ($.isFunction(dp.callback)) {
                                dp.callback(data, me.dictionary.s);
                            }
                        } else {
                            me.log("<span style='color:red'>完成ajax请求,请求出错,错误信息:" + (data.errorMessges || "无") + "</span>");
                            if ($.isFunction(dp.callback)) {
                                dp.callback(data, me.dictionary.f);
                            }
                        }
                    },
                    error: function(xhr, errorType, error) {
                        me.log("【第" + c + "次ajax请求完成，进入error函数，其返回值为:】errorType:" + errorType + "/xhr:" + $.toJSON(xhr) + "/error:" + error);
                        if (window.insaic && window.insaic.ui) {
                            if (!notShowLoading) {
                                insaic.ui.loading().close();
                            }
                        }

                        var errorMessges = '请求服务端失败';
                        if (errorType === "abort" && (!ignoreError.abort)) { //无网络
                            errorMessges = "网络已断开";
                        } else if (errorType === "timeout" && (!ignoreError.timeout)) { //超时
                            errorMessges = "系统连接超时";
                        } else if (errorType === "error") { //服务器或者客户端错误
                            switch (xhr.status) {
                                case 403:
                                    errorMessges = "连接超时，进入登录页面";
                                    window.location.href = insaic.basePrefix + 'login.html'; //退出登录页面
                                    break;
                                case 404:
                                    errorMessges = "未找到服务器";
                                    break;
                                case 500:
                                    errorMessges = "服务器未响应";
                                    break;
                                case 503:
                                    errorMessges = "服务器不可用";
                                    break;
                                case 504:
                                    errorMessges = "网关超时";
                                    break;
                            }
                            //status: int
                            //403-禁止访问
                            //404-未找到
                            //500-内部服务器错误。
                            //503-服务不可用。这个错误代码为IIS6.0所专用。
                            //504-网关超时。
                        }
                        //统一获取ajax错误，回调函数
                        if ($.isFunction(dp.callback)) {
                            dp.callback({
                                xhr: xhr,
                                errorType: errorType,
                                error: error,
                                errorMessges: errorMessges
                            }, me.dictionary.f);
                        }
                    }
                };
                var _dp = new _getPostOptions(notShowLoading);
                _dp = $.extend({}, _dp, options);
                $.ajax(_dp);
            },
            get: function(options) {
                var dp = new _getPostOptions();
                dp = $.extend({}, dp, options);
                $.ajax(dp);
            }
        };
    }();

    /**
     * 判断是否为undefined
     */
    this.isUndefined = function(o) {
        return typeof o === "undefined";
    };

    /**
     * 判断是否为数组类型
     */
    this.isArray = function(o) {
        return o !== null && typeof o === "object" && 'splice' in o && 'join' in o;
    };

    /**
     * 判断是否为object类型
     */
    this.isObject = function(o) {
        return typeof o === "object";
    };

    /**
     * 判断是否为string类型
     */
    this.isString = function(o) {
        return typeof o === "string";
    };

    /**
     * 判断对象是否为空字符串，去除前后空格
     */
    this.isBlank = function(o) {
        o = o || "";
        return o === "" || o.trim() === "";
    };

    /**
     * 获取浏览器类别和版本号
     * @returns string
     */
    this.getBrowser = function() {
        var Sys = {},
            ua = navigator.userAgent.toLowerCase(),
            s;

        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        return Sys;
    }();

    /**
     * 得到地址栏参数
     * @param names 参数名称
     * @param urls 从指定的urls获取参数
     * @returns string
     */
    this.getQueryString = function(names, urls) {
        urls = urls || window.location.href;
        urls && urls.indexOf("?") > -1 ? urls = urls.substring(urls.indexOf("?") + 1) : '';
        var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)", "i");
        var r = urls ? urls.match(reg) : window.location.search.substr(1).match(reg);
        if (r !== null && r[2] !== "") return unescape(r[2]);
        return '';
    };

    /**
     * 获取请求入口
     * @param  {[string]} name [包含字符]
     * @param  {[string]} path [路径或url地址]
     * @return {[type]}      [description]
     */
    this.getEntrance = function(name, path) {
        path = path || window.location.href;
        name = name || 'sgm';
        if (path.indexOf(name) > -1) return true;
        return false;
    };

    /**
     * cookie方法
     * cookie.set()设置cookie
     * cookie.get()获取cookie
     * cookie.clear()清除cookie
     * @type {Object}
     */
    this.cookie = {
        set: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        get: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        },
        clear: function(name) {
            me.cookie.set(name, "", -1);
        }
    };

    /**
     * 非两位数补零
     * @param  {[int]} n [数]
     * @return {[string]}   [返回补零后的两位数]
     */
    function padLeft(n) {
        n = (n).toString();
        return ("00" + n).substr(("" + n).length);
    };

    /**
     * 将数据库中的null替换成指定字符
     * @param  {[null]} n [null]
     * @param  {[string]} r [指定字符]
     * @return {[string]}   [替换后的字符]
     */
    this.replaceNULL = function(n, r) {
        if (n) {
            return n;
        }
        return r;
    };

    /**
     * 替换大括号中的内容
     * @param str
     * @returns {XML|void|string}
     */
    this.replaceBracket = function(str) {
        return str.replace(str.substring(str.indexOf('{'), str.indexOf('}') + 1), '');
    };

    /**
     * iframe自适应高度
     * @param  {[string]} id [元素的ID名称]
     */
    this.autoIframeHeight = function(id) {
        var ifm = document.getElementById(id),
            subWeb = document.frames ? document.frames[id].document : ifm.contentDocument;
        ifm = insaic.replaceNULL(ifm, '');
        subWeb = insaic.replaceNULL(subWeb, '');
        if (ifm !== '' && subWeb !== '') {
            ifm.height = subWeb.body.scrollHeight;
        }
    };

    /**
     * 日期时间
     */
    this.date = {
        /**
         * 对Date的扩展，将 Date 转化为指定格式的String
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * 调用方式：insaic.date.convert('2015-10-10','yyyy年MM月dd日 hh时mm分ss秒')
         * 获取当前时间：insaic.date.convert()
         * @param  {[int|string]} times [时间戳或者日期格式字符串]
         * @param  {[stringe]} fmt   [日期格式，如yyyy-MM-dd hh:mm:ss]
         * @return {[string]}       [指定格式的日期字符串]
         */
        convert: function(times, fmt) {
            times = (typeof(times) === 'undefined' || times === null) ? new Date() : typeof(times) === 'string' ? times.replace(/-/g, '\/') : times;
            fmt = typeof(fmt) === 'undefined' ? 'yyyy-MM-dd' : fmt;
            var date = new Date(times);
            var o = {
                "M+": date.getMonth() + 1, //月
                "d+": date.getDate(), //日
                "h+": date.getHours(), //时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        /**
         * 两时间相比
         * @param  {[int|string]} date      [第一个日期]
         * @param  {[int|string|undefined]} otherDate [第二个日期，可以不传，取当前时间]
         * @return {[number]}           [如果返回值大于0，则第一个日期大于第二个日期；如果小于0，则第一个日期小于第二个日期；如果等于0，则两个日期相同]
         */
        compare: function(date, otherDate) {
            date = typeof(date) === 'string' ? date.replace(/-/g, '\/') : date;
            otherDate = typeof(otherDate) === 'undefined' ? new Date() : typeof(otherDate) === 'string' ? otherDate.replace(/-/g, '\/') : otherDate;

            var d1 = new Date(date),
                d2 = new Date(otherDate);
            return Date.parse(d1) - Date.parse(d2);
        },
        /**
         * 时间相加
         * @param  {[number|string]} date   [起始日期，如时间戳或日期类型的字符串]
         * @param  {[number]} second [秒数 如加一天，则24*60*60；如是减一天，则-24*60*60]
         * @param  {[stringe]} fmt   [日期格式，如yyyy-MM-dd hh:mm:ss]
         * @return {[Date]}
         */
        add: function(date, second, fmt) {
            date = typeof(date) === 'string' ? date.replace(/-/g, '\/') : date;
            date = new Date(date).getTime();
            date = date.valueOf();
            date = date + second * 1000;
            if (typeof(fmt) === 'undefined') {
                return new Date(date);
            } else {
                return me.date.convert(date, fmt);
            }
        },
        /**
         * 时间同步
         * @param sourceId 源时间控件的id
         * @param targetId 目标时间控件的id
         * @param second   需要相加的时间[秒数 如加一天，则24*60*60；如是减一天，则-24*60*60]
         * @param fmt  fmt   [日期格式，如yyyy-MM-dd hh:mm:ss]
         */
        syncdate: function(sourceId, targetId, second, fmt) {
            var targetDate;
            //日期格式默认值
            if (typeof(fmt) === 'undefined') fmt = 'yyyy-MM-dd hh:mm';
            //相加时间默认值
            if (typeof(second) === 'undefined') second = 0;

            if (typeof(newdate) === 'undefined') {
                //目标时间
                targetDate = this.add($('#' + sourceId).val(), second, fmt);
            } else {
                targetDate = this.add(newdate, second, fmt);
            }

            //转换为string,赋值给目标id控件
            $('#' + targetId).val(this.convert(targetDate, fmt));
        }

    };

    /**
     * [保额格式转换]
     * @param  {[number]} n [保额]
     * @return {[number|string]}   [转换后的保额]
     */
    this.insuredFormat = function(n) {
        if (typeof(n) === 'undefined') return 0;
        if (isNaN(n)) return 0;
        n = parseInt(n);
        if (n >= 0 && n < 10000) return n;
        if (n >= 10000) return (n / 10000) + '万';
    };

    /**
     * 输出错误消息，用于ajax返回
     * @param  {[string|object]} errorMsg [错误消息]
     * @return {[bool]}
     */
    this.outputError = function(errorMsg, callBack) {
        var pass = true,
            type = typeof(errorMsg);
        if (type === 'object') {
            var error = [];
            for (var i = 0; i < errorMsg.length; i++) {
                error.push(errorMsg[i].message);
            }
            if (error.length > 0) {
                insaic.ui.alert(error.join('<br />'), callBack);
                pass = false;
            }
        } else {
            insaic.ui.alert(errorMsg, callBack);
            pass = false;
        }
        return pass;
    };

    /**
     * 根目录
     * @return {[string]} [返回根目录]
     */
    this.basePrefix = function() {
        return '/pages/';
    }();

    /**
     * 获取base.js的路径
     * @return {[string]} [路径]
     */
    this.coreInsaicPath = function() {
        var srcUrl = "",
            fileReg = new RegExp(me.coreFileName, "i");

        $("script").each(function() {
            if (fileReg.test($(this).attr("src"))) {
                srcUrl = $(this).attr("src").replace(me.coreFileName, "");
                return false;
            }
        });

        return srcUrl;
    }();

    /**
     * 获取当前目录到根目录路径
     * @return {[string]} [路径]
     */
    this.curpath = function() {
        var corePath = insaic.coreInsaicPath,
            arr = corePath.split('\/'),
            len = arr.length - 4,
            path = '';
        if (len > 0) {
            for (var j = 0; j < len; j++) {
                path += '../';
            }
        }
        return path;
    }();

    /**
     * 获取图片路径
     * @return {[string]} [img文件夹到根目录的路径]
     */
    this.imgpath = function() {
        var path = insaic.coreInsaicPath;
        return path.replace('js', 'img');
    }();

    /**
     * 跳转页面
     * @param  {[string]} rootHtml [跳转页面的路径]
     * @return {[type]}          [description]
     */
    this.gotoUrl = function(rootHtml) {
        rootHtml = rootHtml || 'login.html';
        var path = insaic.curpath += rootHtml;
        window.location.href = path;
    };

    /**
     * unicode字符串转成中文
     * @param  {[string]} str [unicode字符串]
     * @return {[string]}     [中文]
     */
    this.unicodeToUTF = function(str) {
        str = str || '';
        var result = str.match(/\\u[0-9a-fA-F]{4}/g);
        result = insaic.replaceNULL(result, '');
        if (result === '') return str;
        for (var i = 0; i < result.length; i++) {
            str = str.replace(result[i], unescape(result[i].replace("\\u", "%u")));
        }
        return str;
    };

    /**
     * 根据身份证号获取性别
     * @param  {[string]} userCard [身份证号码]
     * @return {[string]}          [MALE:男，  FEMAIL：女]
     */
    this.getSex = function(userCard) {
        return (parseInt(userCard.substr(16, 1)) % 2 == 1) ? 'MALE' : 'FEMAIL';
    };

    /**
     * 根据身份证号码获取年龄
     * @param  {[string]} userCard [身份证号码]
     * @return {[number]}          [年龄]
     */
    this.getAge = function(userCard) {
        var myDate = new Date(),
            month = myDate.getMonth() + 1,
            day = myDate.getDate(),
            age = myDate.getFullYear() - userCard.substring(6, 10) - 1;
        if (userCard.substring(10, 12) < month || (userCard.substring(10, 12) == month && userCard.substring(12, 14) <= day)) {
            age++;
        }
        return age;
    };

}.call(window.insaic);

/**
 * 数据校验
 * input 输入值校验
 */
! function() {
    "use strict";
    var me = this;
    /**
     * 简易表单验证 在需要验证的输入框的class当中添加formCheck值，代表当前输入框需要进行表单验证。
     * 对于验证的格式可以在class当中添加methods当中已经定义的值， class中的值必须使用空格分开。示例（校验为必填且格式为日期格式）：
     * <input type="text" class="formCheck required date"/>
     */
    me.valiformdata = (function() {
        var methods = {};

        /**
         * 返回空字符串 校验通过
         * 返回非空字符串 校验不通过
         */

        /**
         * 验证是否为空(去除空格)
         */
        methods.required = function(p) {
            return $.trim(p.value) !== "" ? "" : p.msg;
        };

        /**
         * 验证日期
         */
        methods.date = function(p) {
            return (/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(p.value)) ? "" : p.msg;
        };

        /**
         * 验证数字,可为负数以及允许存在小数点
         */
        methods.number = function(p) {
            return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(p.value)) ? "" : p.msg;
        };

        /**
         * 验证邮箱地址
         */
        methods.email = function(p) {
            return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
                .test(p.value) || !p.value) ? "" : p.msg;
        };

        /**
         * 验证手机号码
         */
        methods.mobile = function(p) {
            return (/^(1)\d{10}$/.test($.trim(p.value)) || !p.value) ? "" : p.msg;
        };

        /**
         * 验证邮箱地址或者手机号码
         */
        methods.emailormobile = function(p) {
            return (/^(1)\d{10}$|^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/
                .test(p.value)) ? "" : p.msg;
        };

        /**
         * 验证手机号码或者座机号码
         */
        methods.telephoneormobile = function(p) {
            return (/^\(?(0\d{2,3}-?)?\)?\d{7,8}$|^(1)\d{10}$/
                .test($.trim(p.value))) ? "" : p.msg;
        };

        /**
         * 验证座机号码
         */
        methods.telephone = function(p) {
            return (/^\(?(0\d{2,3}-?)?\)?\d{7,8}$/.test(p.value) || !p.value) ? "" : p.msg;
        };
        /**
         * 验证只能为字母和中文 以及点 英文括号
         */
        methods.string = function(p) {
            return (/^[a-zA-Z\u4E00-\u9FA5\.\(\)]+$/.test(p.value) || !p.value) ? "" : p.msg;
        };


        /**
         * 验证中文
         */
        methods.chineseChracter = function(p) {
            return (/^[\u4e00-\u9fa5]+$/.test(p.value)) ? "" : p.msg;
        };

        /**
         * 验证身份证号码
         */
        methods.idcard = function(p) {
            return ((checkIdcard($.trim(p.value)) == "验证通过!") || !p.value) ? "" : p.msg;
        };

        /**
         * 验证地址
         */
        methods.address = function(p) {
            return (/^[0-9a-zA-Z\u4E00-\u9FA5]+$/.test(p.value) || !p.value) ? "" : p.msg;
        };

        /**
         * 邮政编码校验
         */
        methods.postCode = function(p) {
            return (/^\d{6}$/.test(p.value) || !p.value) ? "" : p.msg;
        };

        /**
         * 验证车牌号
         */
        methods.licenseNo = function(p) {
            return (/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/
                .test($.trim(p.value))) ? "" : p.msg;
        };


        /**
         * 验证长度范围
         */
        methods.length = function(p) {
            var from = p.params.split(',')[0];
            var to = p.params.split(',')[1];
            var reg = new RegExp("^.{" + from + "," + to + "}$");
            return reg.test(p.value) ? "" : p.msg;
        };

        /**
         * 数字或者字母大写
         */
        methods.numberUppLetter = function(p) {
            var reg = /^[A-Z0-9]+$/;
            return reg.test(p.value) ? "" : p.msg;
        };

        /**
         * 复杂度校验
         */
        methods.complex = function(p) {
            var reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;
            return reg.test(p.value) ? "" : p.msg;
        };


        /**
         * 正整数检测
         */
        methods.positiveNumber = function(p) {
            return /^[1-9]\d*$/.test(Number(p.value)) ? "" : p.msg;
        };

        /**
         * 特殊字符验证
         */
        methods.specialflag = function(p) {
            return /[@._-]/.test(p.value) ? "" : p.msg;
        };

        /**
         * 组织机构代码
         */
        methods.organizationCode = function(p) {
            return /[a-zA-Z0-9]{8}-[a-zA-Z0-9]/.test(p.value) ? "" : p.msg;
        };

        methods.businessCharter = function(p) {
            return /^[A-Za-z0-9]{1,18}$/.test(p.value) ? "" : p.msg;
        };

        /**
         * VIN码验证
         */
        methods.vin = function(p) {
            // return /^(?![0-9]+$)(?![A-Z]+$)[0-9A-HJ-NP-Y]{17}$/.test(p.value) ? "" : p.msg;
            return /^[0-9A-Z]{17}$/.test(p.value) ? "" : p.msg;
        };

        /**
         * 金钱
         */
        methods.money = function(p) {
            if (/^\d{0,8}(\.\d{0,2})?$/g.test(p.value)) {
                var arry = p.value.split('.');
                if (arry[0] !== '') {
                    return '';
                } else {
                    return p.msg;
                }
            } else {
                return p.msg;
            }
        };

        return {
            /**
             * 校验所有表单
             * @param selector
             * @param callBack
             * @returns {boolean}
             */
            check: function(selector, callBack) {
                if (!selector) {
                    selector = $("[nt-validata-enable='true']");
                }
                var params = params || {};
                var pass = true,
                    _methods, _errors;
                selector.each(function() {
                    var _this = $(this);
                    _methods = _this.attr("nt-validata-methods").split("&") || [];
                    _errors = _this.attr("nt-validata-errors").split("&") || [];
                    for (var m = 0; m < _methods.length; m++) {
                        var methodName = _methods[m].split(":");
                        if (!$.isFunction(methods[methodName[0]])) {
                            continue;
                        }
                        var result = methods[methodName[0]]({
                            value: _this.val().replace(/\r/g, ""),
                            msg: _errors[m],
                            params: (methodName.length > 1 ? methodName[1] : '')
                        });
                        result = result || "";
                        if (result !== "") {
                            if ($.isFunction(callBack)) {
                                callBack(result, _this.attr("id"), methodName[0]);
                            }
                            pass = false;
                            return pass;
                        }
                    }
                });
                return pass;
            },
            /**
             * 校验单个表单
             * @param node
             * @param callBack
             * @param allCall
             * @returns {boolean}
             */
            checkSingleNode: function(node, callBack, allCall) {
                //allCall add 2014-12-30 控制是否验证通过也调用回调函数
                allCall = allCall || false;
                var pass = true;
                if (node) {
                    var _this = node,
                        _methods = _this.attr("nt-validata-methods").split("&") || [],
                        _errors = _this.attr("nt-validata-errors").split("&") || [];
                    for (var m = 0; m < _methods.length; m++) {
                        var methodName = _methods[m].split(":");
                        if (!$.isFunction(methods[methodName[0]])) {
                            continue;
                        }
                        var result = methods[methodName[0]]({
                            value: _this.val().replace(/\r/g, ""),
                            msg: _errors[m],
                            params: (methodName.length > 1 ? methodName[1] : '')
                        });
                        result = result || "";
                        if (result !== "") {
                            if ($.isFunction(callBack)) {
                                callBack(result, _this.attr("id"), methodName[0]);
                            }
                            pass = false;
                            return pass;
                        }
                        if (allCall) {
                            if ($.isFunction(callBack)) {
                                callBack(result, _this.attr("id"), methodName[0]);
                            }
                        }
                    }
                }
                return pass;
            },
            /**
             * 自定义校验规则
             */
            customNode: function(options, callBack) {
                options = $.extend({}, {
                    node: null,
                    methods: '',
                    errors: ''
                }, options);
                var pass = true,
                    node = options.node;

                if (node) {
                    var _this = node,
                        _methods = options.methods.split("&") || [],
                        _errors = options.errors.split("&") || [];
                    for (var m = 0; m < _methods.length; m++) {
                        var methodName = _methods[m].split(":");
                        if (!$.isFunction(methods[methodName[0]])) {
                            continue;
                        }
                        var result = methods[methodName[0]]({
                            value: _this.val().replace(/\r/g, ""),
                            msg: _errors[m],
                            params: (methodName.length > 1 ? methodName[1] : '')
                        });
                        result = result || "";
                        if (result !== "") {
                            $.isFunction(callBack) && callBack(result);
                            pass = false;
                            return pass;
                        }
                    }
                }
                return pass;
            },
            /**
             * 初始化校验规则
             * @param params
             */
            initValiData: function(params) {
                var _methods = params.methods || {},
                    _errors = params.errors || {};
                for (var m in _methods) {
                    var _this = $("#" + m),
                        ms = [],
                        es = [];
                    for (var md in _methods[m]) {
                        if (typeof _methods[m][md] == 'object') {
                            ms.push(md + ":" + _methods[m][md].toString());
                        } else {
                            ms.push(md);
                        }
                        es.push(_errors[m][md]);
                    }
                    _this.attr("nt-validata-methods", ms.join("&"))
                        .attr("nt-validata-errors", es.join("&"))
                        .attr("nt-validata-enable", "true");
                }
            }
        };
    })();

    // 验证身份证
    function checkIdcard(idcard) {
        idcard = idcard.toUpperCase();
        var Errors = new Array("验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!",
            "身份证号码校验错误!", "身份证地区非法!");
        var area = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var Y, JYM;
        var S, M;
        var idcard_array = [];
        idcard_array = idcard.split("");
        var ereg, eregNow;
        if (area[parseInt(idcard.substr(0, 2))] == null)
            return Errors[4];
        switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard
                        .substr(6, 2)) + 1900) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; // 测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; // 测试出生日期的合法性
                }
                if (ereg.test(idcard))
                    return Errors[0];
                else
                    return Errors[2];
                break;
            case 18:
                if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard
                        .substr(6, 4)) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
                    eregNow = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
                    eregNow = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard) || eregNow.test(idcard)) {
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y, 1);
                    if (M == idcard_array[17])
                        return Errors[0];
                    else
                        return Errors[3];
                } else
                    return Errors[2];
                break;
            default:
                return Errors[1];
                break;
        }
    };

}.call(window.insaic, window.jQuery);

/**
 * 格式化输入框的值
 * input 输入值校验
 */
! function() {
    "use strict";
    var me = this;

    me.formatText = function($this) {
        var c = $($this);
        if (!insaic.isUndefined(c) && c.attr('data-type') === 'number') {
            var reg = /[^\d\.]/g;

            if (reg.test(c.val())) {
                var temp_amount = c.val().replace(reg, '');
                c.val(temp_amount);
            }
        }
    };


}.call(window.insaic, window.jQuery);


/**
 * ui.loading
 * 组件 等待加载框
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};

    me.ui.loading = function() {
        var _create = function() {
            var html = [];
            html.push('<div id="ui-loading-backdrop" class="ui-loading-backdrop"></div>');
            html.push('<div id="ui-loading-bar" class="ui-loading-bar">');
            html.push(' <h3 class="ui-loading-img"></h3>');
            html.push(' <p class="ui-loading-text">拼命加载中，请稍等...</p>');
            html.push('</div>');
            return $(html.join(''));
        };
        return {
            open: function() {
                if ($('#ui-loading-backdrop').size() === 0) {
                    $('body').append(_create());
                } else {
                    $('#ui-loading-backdrop,#ui-loading-bar').show();
                }
            },
            close: function() {
                if ($('#ui-loading-backdrop').size() > 0) {
                    $('#ui-loading-backdrop,#ui-loading-bar').hide();
                }
            }
        };
    };
}.call(window.insaic, window.jQuery);


/**
 * ui.alert
 * 组件 消息提示框
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};

    me.ui.alert = function(msg, callback) {
        var _open = function(msg) {
            if ($('#ui-alert-bar').size() == 0) {
                var html = [];
                html.push('<div id="ui-alert-backdrop" class="ui-alert-backdrop"></div>');
                html.push('<div id="ui-alert-bar" class="alert ui-alert-bar">');
                html.push(' <button type="button" class="close" data-dismiss="alert">&times;</button>');
                html.push(' <p class="ui-alert-text">' + msg + '</p>');
                html.push(' <button class="btn" name="1" type="button" style="float:right">确认</button>');
                html.push('</div>');
                $('body').append(html.join(''));
            } else {
                $('#ui-alert-bar p').html(msg);
            }

            $('#ui-alert-bar').bind('closed', function() {
                $('#ui-alert-backdrop').remove();
            });

            $('#ui-alert-bar .btn').bind('click', function() {
                $('#ui-alert-backdrop,#ui-alert-bar').remove();
                var flag = $(this).attr('name') === '1' ? true : false;
                $.isFunction(callback) && callback(flag);
            });
        };
        _open(msg);
        try {
            $("#ui-alert-bar").alert();
        } catch (e) {
            $('#ui-alert-backdrop,#ui-alert-bar').remove();
        }
    };
}.call(window.insaic, window.jQuery);

/**
 * ui.confirm
 * 组件 消息确认框
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};

    me.ui.confirm = function(msg, callback) {
        var _open = function(msg) {
            if ($('#ui-confirm-bar').size() == 0) {
                var html = [];
                html.push('<div id="ui-confirm-backdrop" class="ui-alert-backdrop"></div>');
                html.push('<div id="ui-confirm-bar" class="alert ui-alert-bar">');
                html.push(' <button type="button" class="close" data-dismiss="alert">&times;</button>');
                html.push(' <p class="ui-alert-text">' + msg + '</p>');
                html.push(' <div class="tr">');
                html.push('     <button class="btn" type="button" name="1">确认</button>');
                html.push('     <button class="btn" type="button" name="0">取消</button>');
                html.push(' </div>');
                html.push('</div>');
                $('body').append(html.join(''));
            } else {
                $('#ui-confirm-bar p').html(msg);
            }

            $('#ui-confirm-bar').bind('closed', function() {
                $('#ui-confirm-backdrop').remove();
                $.isFunction(callback) && callback(false);
            });

            $('#ui-confirm-bar .btn').bind('click', function() {
                $('#ui-confirm-backdrop,#ui-confirm-bar').remove();
                var flag = $(this).attr('name') === '1' ? true : false;
                $.isFunction(callback) && callback(flag);
            });

        };
        _open(msg);
        try {
            $("#ui-confirm-backdrop").alert();
        } catch (e) {
            $('#ui-confirm-backdrop,#ui-confirm-bar').remove();
            $.isFunction(callback) && callback(false);
        }
    };
}.call(window.insaic, window.jQuery);


/**
 * ui.cityOptions
 * 组件 省市区县选择控件
 * 二级省市联动插件 支持扩展，但是需要数据结构一致
 * 参数说明：
 * firstStageCode:第一级code
 * firstStageName:第一级name
 * secondStageCode:第二级code
 * secondStageName:第二级name
 * firstCodeValue:默认一级菜单的
 * firstObjId:一级菜单的select的id
 * secondObjId:二级菜单的select的id
 *
 *数据格式如下：
 * var areaArray = [{
 *  "provinceCode": "110000",
 *  "provinceName": "北京市",
 *  "cityCode": "110100",
 *  "cityName": "市辖区",
 *  "districtCode": "110101",
 *  "districtName": "东城区"
 *}, {
 *  "provinceCode": "110000",
 *  "provinceName": "北京市",
 *  "cityCode": "110100",
 *  "cityName": "市辖区",
 *  "districtCode": "110102",
 *  "districtName": "西城区"
 *}]
 *
 * 调用方式如下：
 * ..cityOptions({
 *     firstStageCode:'provinceCode',
 *     firstStageName:'provinceName',
 *     secondStageCode:'cityCode',
 *     secondStageName:'cityName',
 *     firstCodeValue:'140000',
 *     firstObjId:'provinceId',
 *     secondObjId:'cityId'
 * });
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};
    me.ui.cityOptions = function(settings) {
        if (this.length < 1) {
            return null;
        }

        // 默认值
        settings = $.extend({
            firstStageCode: '',
            firstStageName: '',
            secondStageCode: '',
            secondStageName: '',
            firstCodeValue: null, //默认一级菜单的code值
            secondCodeValue: null,
            firstObjId: 'provinceId', //
            secondObjId: 'cityId'
        }, settings);

        var first_obj = $("#" + settings.firstObjId);
        var second_obj = $("#" + settings.secondObjId);
        var data_json = areaArray;
        var oldFirstStageCode = '0'; //old一级下拉框的值，如：110000
        var oldSecondStageCode = '0'; //old二级下拉框的值，如：110100
        var temp_html;

        // 二级下拉框赋值
        var secondStart = function() {
            var prov_id = first_obj.val();
            //以下为直辖市，特殊处理，只显示一级下拉
            temp_html = "";
            if ("110000" === prov_id || "120000" === prov_id || "500000" === prov_id || "310000" === prov_id) {
                temp_html += "<option value='" + prov_id + "'>" + $('#provinceId option:selected').text() + "</option>";
            } else {
                $.each(data_json, function(i, city) {
                    if (prov_id === city[settings.firstStageCode] && oldSecondStageCode !== city[settings.secondStageCode]) {
                        temp_html += "<option value='" + city[settings.secondStageCode] + "'>" + city[settings.secondStageName] + "</option>";
                        oldSecondStageCode = city[settings.secondStageCode];
                    }
                });
            }
            second_obj.show();
            second_obj.empty().append(temp_html);
        };

        var init = function() {

            // 遍历赋值一级下拉列表
            temp_html = "";
            $.each(data_json, function(i, prov) {
                if (oldFirstStageCode !== prov[settings.firstStageCode]) {
                    temp_html += "<option value='" + prov[settings.firstStageCode] + "'>" + prov[settings.firstStageName] + "</option>";
                    oldFirstStageCode = prov[settings.firstStageCode];
                }
            });
            first_obj.html(temp_html);

            $("#provinceId option[value='" + settings.firstCodeValue + "']").attr("selected", "selected");
            secondStart();
            $("#cityId option[value='" + settings.secondCodeValue + "']").attr("selected", "selected");

            // 选择一级下拉框发生事件
            first_obj.on("change", function() {
                secondStart();
            });

            // 选择市级时发生事件
            second_obj.on("change", function() {});
        };
        //初始化
        init();
    };
}.call(window.insaic, window.jQuery);

/**
 * ui.provincesReferred
 * 组件 省市简称选择控件
 * 等继续完成
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};
    var shortProv = {
        110000: '京',
        120000: '津',
        130000: '冀',
        140000: '晋',
        150000: '蒙',
        210000: '辽',
        220000: '吉',
        230000: '黑',
        310000: '沪',
        320000: '苏',
        330000: '浙',
        340000: '皖',
        350000: '闽',
        360000: '赣',
        370000: '鲁',
        410000: '豫',
        420000: '鄂',
        430000: '湘',
        440000: '粤',
        450000: '桂',
        460000: '琼',
        500000: '渝',
        510000: '川',
        520000: '黔',
        530000: '滇',
        540000: '藏',
        610000: '陕',
        620000: '甘',
        630000: '青',
        640000: '宁',
        650000: '新',
        810000: '港',
        820000: '澳'
    };
    me.ui.provincesReferred = function(params) {
        var referred = {
            create: function() {
                if ($('#ui-referred').size() <= 0) {
                    var off = params.offset(),
                        top = (off.top + params.outerHeight(true)) + 'px',
                        left = off.left + 'px',
                        h = [];
                    h.push('<ul class="ui-referred" id="ui-referred" style="top:' + top + ';left:' + left + '">');
                    for (var key in shortProv) {
                        h.push('<li data-code="' + key + '">' + shortProv[key] + '</li>');
                    }
                    h.push('</ul>');
                    $('body').append(h.join(''));
                    //绑定事件
                    $('#ui-referred li').on('click', function(event) {
                        var txt = $(this).text(),
                            code = $(this).attr('data-code');
                        if (params.is('input')) {
                            params.val(txt);
                        } else {
                            params.text(txt);
                        }
                        params.attr('data-code', code);
                        referred.remove();
                        event.stopPropagation();
                    });
                }
            },
            remove: function() {
                if ($('#ui-referred').size() > 0) {
                    $('#ui-referred').remove();
                }
            },
            init: function() {
                referred.create();
            }
        };
        referred.init();
    };
}.call(window.insaic, window.jQuery);

/**
 * ui.toast
 * 组件 提示并消失控件
 * 待开发
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};
    me.ui.toast = function(params) {

    };
}.call(window.insaic, window.jQuery);

/**
 * ui.print
 * 组件 打印控件
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};
    /**
     * fileID：文件的FileID，与生成TPF的XML中fileid节点值相对应，字符串。
     * itdsURL：TDS服务器的URL即端口，字符串。比如：http://172.86.50.86:8080.
     * IDType：文件类型，TPF文件为1，正整数。
     * insurerCode：保险公司代码
     * orderNo：订单号
     * documentType：打印单证类型
     * @type {JSON}
     */
    me.ui.print = function(params) {
        var $pm = $('#printModal'),
            options = $.extend({
                orderNo: '', //订单号
                insurerCode: '', //保险公司
                docType: null, //保单类型
                streamVal: '', //保单号
                continueStreamVal: '', //续页单证号
                invoiceCode: '', //发票代码
                invoiceNo: '' //发票号
            }, params);

        var init = function() {
            //校验保单号
            if ($.inArray(options.docType, insaic.config.documentType_printStreamNo) > -1) {
                if (options.streamVal === '') {
                    $('#streamNo').next('.error-inline').removeClass('hide');
                    return;
                }
            }
            //校验续页单证号
            if ($.inArray(options.docType, insaic.config.documentType_continueStreamNo) > -1 &&
                $('#group-continueStreamNo').hasClass('isContinuePage')) {
                if (options.continueStreamVal === '') {
                    $('#continueStreamNo').next('.error-inline').removeClass('hide');
                    return;
                }
            }
            //校验发票代码和发票号，目前只有picc需要发票
            if ($.inArray(options.docType, insaic.config.documentType_printInvoice) > -1 && options.insurerCode === 'picc') {
                //发票代码校验
                if (options.invoiceCode === '') {
                    $('#invoiceCode').next('.error-inline').removeClass('hide');
                    return;
                }
                //发票号校验
                if (options.invoiceNo === '') {
                    $('#invoiceNo').next('.error-inline').removeClass('hide');
                    return;
                }
            }
            //隐藏提示信息
            $pm.find('.error-inline').addClass('hide');
            //调用打印接口
            sendPrint({
                orderNo: options.orderNo,
                documentType: options.docType,
                documentNo: options.streamVal,
                continueDocumentNo: options.continueStreamVal,
                invoiceCode: options.invoiceCode,
                invoiceNo: options.invoiceNo
            });
        };
        var sendPrint = function(data) {
            var params = {
                transCode: 'TY1008',
                request: data,
                callback: function(response, status) {
                    if (status !== insaic.dictionary.s) {
                        return void insaic.outputError(response.errorMessges);
                    }
                    var result = response.result;
                    if (result.continuePage === true &&
                        $.inArray(options.docType, insaic.config.documentType_continueStreamNo) > -1) {
                        $('#continueTip').removeClass('hide');
                        //续页单证号显示
                        $('#group-continueStreamNo').addClass('isContinuePage');
                        $('#group-continueStreamNo').removeClass('hide');
                        loadContinueStreamNo();
                        return;
                    }
                    //保单号、发票代码、发票号、续页单证号清空
                    $('#streamNo,#invoiceCode,#invoiceNo,#continueStreamNo').val('');
                    //启动打印插件
                    print({
                        fileID: result.fileId,
                        itdsURL: result.itcUrl,
                        IDType: result.itcType,
                        insurerCode: result.insurer,
                        orderNo: data.orderNo,
                        documentType: $('#documentType').find('input:radio[name=optionsRadios]:checked').val()
                    });
                }
            };
            insaic.ajax.post(params);
        };
        var loadContinueStreamNo = function() {
            $('#continueStreamNoTip').addClass('hide');
            var params = {
                transCode: 'BS1003',
                request: {
                    documentType: 'POLICY_CONTINUE',
                    insurerCode: $('select[name="insurerCode"] option:selected').val()
                },
                callback: function(response, status) {
                    if (status !== insaic.dictionary.s) {
                        insaic.log('获取默认最小续页单证号失败，失败原因：' + response.errorMessges);
                        //如果接口错误，则清空单证号文本框
                        $('#continueStreamNo').val('');
                        return;
                    }
                    var result = response.result;
                    var documentNo = insaic.replaceNULL(result.documentNo, '');
                    $('#continueStreamNo').val(documentNo);

                    if (documentNo !== '') {
                        $('#continueStreamNoTip').removeClass('hide');
                        $('#continueStreamNoTip').prev('.error-inline').addClass('hide');
                    }
                }
            };
            insaic.ajax.post(params);
        };
        var print = function(params) {
            var dp = $.extend({}, options, params);
            insaic.log(dp.insurerCode + '在打印了,其入参是：' + $.toJSON(dp));
            if ($.inArray(dp.documentType, insaic.config.documentType_printInvoice) > -1 && dp.insurerCode === 'cpic') {
                insaic.log('打开太保的发票打印界面...');
                window.open(dp.itdsURL, '上汽保险发票打印', 'width=1024,height=700,menubar=no,resizable=no,titlebar=no,toolbar=no,location=no,status=no');
            } else {
                var path = '../print/itc.html?insurer=' + dp.insurerCode + '&id=' + dp.fileID + '&url=' + encodeURIComponent(dp.itdsURL) + '&type=' + dp.IDType + '&orderNo=' + dp.orderNo + '&documentType=' + dp.documentType;
                $('body').append('<iframe src="' + path + '" width="200" height="200" frameborder="0" scrolling="no" style="display:none"></iframe>');
            }
        };

        init();
    };

}.call(window.insaic, window.jQuery);

/**
 * ui.pages
 * 组件 分页控件
 */
! function() {
    "use strict";

    var me = this;
    me.ui = me.ui || {};
    me.ui.pages = function(el, currentPage, totalPage) {
        totalPage = parseInt(totalPage);
        if (totalPage <= 1) return;
        currentPage = parseInt(currentPage);
        currentPage++;
        var p = [],
            showPage = 7, //最多显示7个页码
            halfPage = (showPage - 1) / 2, //一半显示页码数
            startPage = currentPage - halfPage, //显示页码的开始数
            endPage = currentPage + halfPage; //显示页码的结束数
        if (startPage < 1) {
            startPage = 1;
            endPage = showPage > totalPage ? totalPage : showPage;
        }
        if (endPage > totalPage) {
            startPage = startPage - (endPage - totalPage);
            startPage = startPage < 1 ? 1 : startPage;
            endPage = totalPage;
        }

        p.push('<ul>');
        if (currentPage > 1) p.push('<li><a href="javascript:;" class="prev">上一页</a></li>');
        for (var i = startPage; i < endPage + 1; i++) {
            if (i == currentPage) {
                p.push('<li class="active"><a href="javascript:;" name="current">' + i + '</a></li>');
            } else {
                p.push('<li><a href="javascript:;">' + i + '</a></li>');
            }
        }
        if (currentPage < totalPage) p.push('<li><a href="javascript:;" class="next">下一页</a></li>');
        p.push('</ul>');
        el.empty().html(p.join(''));
    };
}.call(window.insaic, window.jQuery);


/**
 * 菜单栏
 * 组件 菜单栏和功能栏
 */
! function() {
    "use strict";
    var me = this;
    me.menus = me.menus || {};
    me.menus.options = {
        menusID: insaic.getQueryString('menusID'), //功能(菜单)编号
        menusCode: insaic.getQueryString('menusCode'), //功能(菜单)代码
        inconElement: $('.home-left'), //追加显示功能的元素
        showFunction: true, //是否显示功能列表
        callBack: function() {} //回调函数
    };

    me.menus.init = function(options) {
        var dp = insaic.menus.options;
        dp = $.extend({}, dp, options);
        insaic.menus.options = dp;
        var codeArray = [];
        if (window.location.href.indexOf('default') > 0) {
            codeArray = insaic.config.functionLayout.home;
        }
        if (window.location.href.indexOf('newveh') > 0) {
            codeArray = insaic.config.functionLayout.newveh;
        }
        getMenus(me.menus.options.menusID, me.menus.options.menusCode, codeArray);
    };

    /**
     * 根据入参获取菜单数据
     * @param  {[string]} id   [功能id]
     * @param  {[string]} code [功能代码]
     * @return {[void]}      [description]
     */
    function getMenus(menusID, menusCode, array) {
        var params = {
            showLoading: false,
            transCode: 'TY1012',
            request: {
                functionId: menusID,
                parentFuncCode: menusCode,
                pageHomeList: array
            },
            callback: function(response, status) {
                if (status !== insaic.dictionary.s) {
                    var e_msg = response.errorMessges;
                    if (typeof e_msg === 'object') {
                        var out_msg = [];
                        for (var i = 0; i < e_msg.length; i++) {
                            out_msg.push(e_msg[i].message);
                        }
                        if (out_msg.length > 0) insaic.log(out_msg.join('<br />'));
                    } else {
                        insaic.log(e_msg);
                    }
                    insaic.gotoUrl();
                }

                var result = response.result,
                    menus = result.menuFunction, //导航栏数据集
                    features = result.iconFunction, //功能菜单数据集
                    dealerView = result.dealer; //经销商信息
                showNav(menus);
                if (insaic.menus.options.showFunction) showFeatures(features);
                //顶部处理
                //用户名
                $('.top-user').text(dealerView.userName);
                //客户服务
                if (dealerView.isDealerGroup === 'Y') {
                    //经销商集团客户2个号码都显示
                    $("#top-service .contact1 li").addClass("show");
                    $("#top-service .service-contact .contact1").addClass("show");
                } else {
                    //显示对应经销商品牌服务热线号码
                    var manu = $.trim((dealerView.manufactory).toLowerCase());
                    if (manu === '') {
                        $('#top-service .contact li').addClass("show");
                    } else {
                        $('#top-service .contact li.' + manu).addClass("show");
                    }
                }
                //鼠标事件
                $("#top-service").mouseover(function() {
                    $(".service-contact").css("display", "block");
                }).mouseout(function() {
                    $(".service-contact").css("display", "none");
                });
                //文档
                var docUrl = $('#top-documents').find('a').attr('href');
                if (docUrl) {
                    var _href = insaic.basePrefix + docUrl;
                    $('#top-documents').find('a').attr('href', _href);
                }
                //安全退出
                if (insaic.getEntrance()) {
                    $("#top-right li.exit").addClass("hide");
                }

                $.isFunction(insaic.menus.options.callBack) && insaic.menus.options.callBack(dealerView);
            }
        };
        insaic.ajax.post(params);
    };

    /**
     * 显示导航栏
     * @param  {[JSON]} data  [导航栏数据集]
     * @param  {[元素]} el    [显示导航栏位置的元素]
     * @param  {[number]} index [当前页面在导航栏中的下坐标号]
     * @return {[void]}
     */
    function showNav(data, el) {
        var prefix = insaic.basePrefix,
            html = [];
        html.push('<ul class="nav-link">');
        html.push('<li><a href="' + prefix + 'default.shtml">首页</a></li>');
        for (var i = 0; i < data.length; i++) {
            var _functionUrl = insaic.replaceNULL(data[i].functionUrl, ''),
                _functionId = insaic.replaceNULL(data[i].functionId, ''),
                _functionCode = insaic.replaceNULL(data[i].functionCode, ''),
                _functionCap = insaic.replaceNULL(data[i].functionCap, ''),
                _url = _functionUrl === '' ? 'sub.shtml' : _functionUrl;

            _url = prefix + _url;
            _url += '?menusID=' + _functionId + '&menusCode=' + _functionCode;
            html.push(' <li');
            if (me.menus.options.menusCode === _functionCode) {
                html.push(' class="active"');
            }
            html.push('><a href="' + _url + '">' + _functionCap + '</a></li>');
        }
        html.push('</ul>');
        el = insaic.isUndefined(el) ? $('.header-nav') : el;
        el.html(html.join(''));
        if (me.menus.options.menusCode === '') {
            el.find('li').removeClass('active');
            el.find('li:eq(0)').addClass('active');
        }
    };


    /**
     * 类别标题显示
     * @param  {[数组]} data [图标集合]
     * @return {[void]}
     */
    function showFeatures(data) {
        var h = [];
        for (var i = 0; i < data.length; i++) {
            var options = data[i].functionEOList,
                len = options.length,
                corePath = insaic.imgpath;
            if (len > 0) {
                h.push('<ul class="home-list">');
                for (var j = 0; j < len; j++) {
                    var cap = insaic.replaceNULL(options[j].functionCap, ''),
                        icon = insaic.replaceNULL(options[j].functionIcon, ''),
                        url = insaic.replaceNULL(options[j].functionUrl, ''),
                        insureCode = insaic.replaceNULL(options[j].insureCode, ''), //保险公司代码
                        agreementCode = insaic.replaceNULL(options[j].agreementCode, ''), //协议代码
                        marketingId = insaic.replaceNULL(options[j].marketingId, ''), //营销活动ID
                        inputMode = insaic.replaceNULL(options[j].inputMode, ''), //录入模式，1：快捷 2：标准
                        insuredMode = insaic.replaceNULL(options[j].insuredMode, '');
                    if (insaic.isUndefined(inputMode)) inputMode = '';

                    if (url === '') {
                        url = 'javascript:;';
                    } else {
                        var symbol = (/\?/.test(url)) ? '&' : '?';
                        url += symbol + 'menusID=' + me.menus.options.menusID + '&menusCode=' + me.menus.options.menusCode;
                    }
                    h.push('<li>');
                    h.push('    <a href="' + url + '"><img src="' + corePath + icon + '" alt="上汽保险" /></a>');
                    h.push('    <p><a href="' + url + '">' + cap + '</a></p>');
                    h.push('</li>');
                }
                h.push('</ul>');
            }
        }
        var $el = insaic.menus.options.inconElement;
        $el.html(h.join(''));
    };

}.call(window.insaic, window.jQuery);


/**
 * ui.loading
 * 组件 等待加载框
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};

    me.ui.choose = function(params) {
        var chooseMain = {
            options: {
                dealerElement: null,
                agreementsElement: null,
                requestData: {},
                callBack: null
            },
            getDealer: function() {
                var me = this;
                var params = {
                    transCode: 'DTA101',
                    request: me.options.requestData,
                    callback: function(response, status) {
                        if (status !== insaic.dictionary.s) {
                            return void insaic.outputError(response.errorMessges);
                        }
                        var dealers = response.result;
                        me.displayDealer(dealers);
                    }
                };
                insaic.ajax.post(params);
            },
            displayDealer: function(data) {
                var html = [],
                    len = data.length;
                if (len === 0) {
                    html.push('<p class="ui-choose-none">未查询到任何经销商信息</p>');
                } else {
                    html.push('<ul class="ui-chosee-box">');
                    for (var i = 0; i < len; i++) {
                        html.push(' <li data-dealer=' + $.toJSON(data[i]) + '>');
                        html.push('     <h3>' + data[i].brandCode + '</h3>');
                        html.push('     <p title="' + data[i].dealerName + '">' + data[i].dealerName + '</p>');
                        html.push('     <div class="ui-checked-incon"></div>');
                        html.push(' </li>');
                    }
                    html.push('</ul>');
                }
                this.options.dealerElement.html(html.join(''));

                if (len > 1) {
                    //绑定选择事件
                    var $li = this.options.dealerElement.find('ul.ui-chosee-box li');
                    $li.each(function(index, el) {
                        $(el).click(function(event) {
                            if (!$(this).hasClass('ui-selected-color')) {
                                $li.removeClass('ui-selected-color');
                                $(this).addClass('ui-selected-color');

                                var dealerInfo = $(this).attr('data-dealer');
                                var backResult = {};
                                if (dealerInfo) backResult = $.evalJSON(dealerInfo);
                                $.isFunction(chooseMain.options.callBack) && chooseMain.options.callBack(backResult);
                            }
                        });
                    });
                } else {
                    $.isFunction(chooseMain.options.callBack) && chooseMain.options.callBack(data[0]);
                }
            },
            getAgreements: function() {
                var me = this;
                var params = {
                    transCode: 'DTA102',
                    request: me.options.requestData,
                    callback: function(response, status) {
                        if (status !== insaic.dictionary.s) {
                            return void insaic.outputError(response.errorMessges);
                        }
                        var agreements = response.result;
                        me.displayAgreements(agreements);
                    }
                };
                insaic.ajax.post(params);
            },
            displayAgreements: function(data) {
                var html = [],
                    len = data.length,
                    corePath = insaic.imgpath;
                if (len === 0) {
                    html.push('<p class="ui-choose-none">未查询到任何协议信息</p>');
                } else {
                    html.push('<ul class="ui-chosee-box">');
                    for (var i = 0; i < len; i++) {
                        html.push(' <li data-agreements=' + $.toJSON(data[i]) + '>');
                        html.push('     <img src="' + corePath + 'insure/' + (data[i].insurer).toLowerCase() + '.png" alt="' + insaic.config.policyCompany[data[i].insurer] + '" />');
                        html.push('     <div class="ui-checked-incon"></div>');
                        html.push(' </li>');
                    }
                    html.push('</ul>');
                }
                this.options.agreementsElement.html(html.join(''));

                if (len > 1) {
                    //绑定选择事件
                    var $li = this.options.agreementsElement.find('ul.ui-chosee-box li');
                    $li.each(function(index, el) {
                        $(el).click(function(event) {
                            if (!$(this).hasClass('ui-selected-color')) {
                                $li.removeClass('ui-selected-color');
                                $(this).addClass('ui-selected-color');

                                var agreementsInfo = $(this).attr('data-agreements');
                                var backResult = {};
                                if (agreementsInfo) {
                                    backResult = $.evalJSON(agreementsInfo);
                                }
                                $.isFunction(chooseMain.options.callBack) && chooseMain.options.callBack(backResult);
                            }
                        });
                    });
                } else {
                    $.isFunction(chooseMain.options.callBack) && chooseMain.options.callBack(data[0]);
                }
            }
        };

        if (!insaic.isUndefined(params)) chooseMain.options = $.extend({}, chooseMain.options, params);

        return {
            getDealer: function() {
                chooseMain.getDealer();
            },
            getAgreements: function() {
                chooseMain.getAgreements();
            }
        };
    };
}.call(window.insaic, window.jQuery);


/**
 * ui.selectDealer
 * 组件 选择经销商下拉框
 */
! function() {
    "use strict";
    var me = this;
    me.ui = me.ui || {};

    me.ui.selectDealer = function(params) {
        var chooseMain = {
            options: {
                elementName: null,
                isAll: true
            },
            getDealers: function() {
                var params = {
                    transCode: 'DTA101',
                    request: {},
                    callback: function(response, status) {
                        $('select[name="' + chooseMain.options.elementName + '"]').empty();
                        if (status !== insaic.dictionary.s) {
                            return void insaic.outputError(response.errorMessges);
                        }
                        var dealers = response.result;
                        chooseMain.display(dealers);
                    }
                };
                insaic.ajax.post(params);
            },
            display: function(data) {
                var html = [];
                var len = data.length;
                if (len > 1 && this.options.isAll) html.push('<option value="0">全部</option>');
                for (var i = 0; i < len; i++) {
                    html.push('<option value="' + data[i].dealerCode + '">' + data[i].dealerName + '</option>');
                }
                $('select[name="' + this.options.elementName + '"]').append(html.join(''));
            },
            getDealersCode: function() {
                var checkCode = $('select[name="' + this.options.elementName + '"] option:selected').val();
                if (checkCode === '0') {
                    var _options = $('select[name="' + this.options.elementName + '"] option');
                    var codes = [];
                    for (var i = 1; i < _options.length; i++) {
                        codes.push($(_options[i]).val());
                    }
                    return codes.join(',');
                } else {
                    return checkCode;
                }
                return '';
            }
        };

        if (!insaic.isUndefined(params)) chooseMain.options = $.extend({}, chooseMain.options, params);

        return {
            setDealers: function() {
                chooseMain.getDealers();
            },
            getDealersCode: function() {
                return chooseMain.getDealersCode();
            }
        };
    };
}.call(window.insaic, window.jQuery);

/**
 * config文件
 * 页面配置文件
 */
! function() {
    "use strict";

    var me = this;
    me.config = me.config || {
        pageSize: 10,
        vehicle: {
            'licenseNo': '车牌号',
            'vin': '车架号',
            'engineNo': '发动机号',
            'vehicleVariety': '车辆种类',
            'registerDate': '初次登记日期',
            'modelName': '车辆名称',
            'emptyWeight': '整备质量(KG)',
            'seatCount': '核定载客数量',
            'exhaustScale': '排量(ml)',
            'fuelType': '机动车燃料种类',
            'makeDate': '生产日期',
            'usage': '使用性质',
            'loanOrganization': '贷款机构'
        },
        fuel: {
            'FUEL': '燃油',
            'PURE_ELECTRIC': '纯电动',
            'FUEL_CELL': '燃料电池',
            'PLUGIN_HYBRID': '插电式混合动力',
            'OTHER_HYBRID': '其他混合动力'
        },
        usage: {
            'PERSON': '家庭自用车',
            'GOVERNMENT': '党政机关用车',
            'GROUP': '事业团体用车',
            'NONBUSI_COMPANY': '非营运企业用车',
            //'TAXI': '出租车',
            'RENT': '租赁车'
        },
        loanOrganization: {
            1: "上汽财务",
            2: "通用金融",
            3: "中国工商银行",
            4: "中国农业银行",
            5: "中国银行",
            6: "中国建设银行",
            7: "中国交通银行",
            8: "上海浦东发展银行",
            9: "招商银行",
            10: "中国邮政储蓄银行",
            11: "民生银行",
            12: "中信银行",
            13: "上海银行",
            14: "国家开发银行",
            15: "广东发展银行",
            16: "中国农业发展银行",
            17: "中国光大银行",
            18: "华夏银行",
            19: "兴业银行",
            20: "徽商银行",
            21: "昆仑银行",
            22: "东莞银行",
            23: "花旗银行",
            24: "渣打银行",
            25: "东亚银行",
            26: "永亨银行"
        },
        certificateType: {
            'ID_CARD': '身份证',
            'PASSPORT': '护照',
            'ORG_CODE': '组织机构代码',
            'BUSINESS_LICENSE': '营业执照'
        },
        vehicleRelationship: {
            'OWNER': '车辆所有人',
            'MANAGER': '车辆管理人',
            //'DRIVER': '保险人允许的合法驾驶员',
            'OTHER': '其他'
        },
        vehicleOwnerNature: {
            'PERSON': '个人',
            'GOVORG': '机关',
            'COMPANY': '企业'
        },
        vehicleVariety: {
            '11': '6座以下客车',
            '12': '6座及10座以下客车',
            '13': '10座及20座以下客车',
            '14': '20座及36座以下客车',
            '15': '36座及36座以上客车'
        },
        documentType: {
            'BIZ_POLICY': '商业险保单',
            'CTP_POLICY': '交强险保单',
            'CTP_MARK': '交强险标志',
            'APPLICATION': '投保单',
            'BIZ_INVOICE': '商业险发票',
            'CTP_INVOICE': '交强险发票',
            'BIZ_SERVICE_CARD': '商业险服务卡',
            'PAY_NOTICE': '缴费通知书'
        },
        documentType_doc: {
            'BIZ_POLICY': '商业险保单',
            'CTP_POLICY': '交强险保单',
            'CTP_MARK': '交强险标志',
            'POLICY_INVOICE': '保单发票',
            'POLICY_CONTINUE': '保单续页'
        },
        documentType_printStreamNo: ['BIZ_POLICY', 'CTP_POLICY', 'CTP_MARK'],
        documentType_continueStreamNo: ['BIZ_POLICY', 'CTP_POLICY'], //保单可能有续页
        documentType_printInvoice: ['BIZ_INVOICE', 'CTP_INVOICE'],
        documentType_printPolicyInvoice: 'POLICY_INVOICE',
        complainType: {
            '1': '换件要求未满足',
            '2': '查勘（定损）时间长',
            '3': '理赔流程复杂，指引不清晰',
            '4': '服务态度差',
            '5': '其他'
        },
        policyType: {
            'COMPREHENSIVE': '商业险',
            'COMPULSORY': '交强险'
        },
        policyStatus: {
            'DELETE': '删除',
            'EXPIRE': '期满',
            'PASS': '核保通过',
            'RECORD': '录入',
            'REFUND': '全退',
            'REJECT': '拒保',
            'UNDERWRITING': '待核保',
            'VALID': '有效',
            'MANUAL': '递交人工'
        },
        policyCompany: { //推送信息登记，人保、太保、国寿财优先放在下拉框前三，添加其他保险公司请在下面累加
            'picc': '中国人保财险',
            'cpic': '中国太保财险',
            'gpic': '中国人寿财险',
            'paic': '中国平安财险',
            'cicp': '中华联合财险',
            'ccic': '中国大地财险',
            'taic': '天安保险',
            'yaic': '永安财产保险',
            'ygbx': '阳光财产保险',
            'abic': '安邦财产保险',
            'tpic': '中国太平保险',
            'other': '其他保险公司'
        },
        orderStatus: {
            'EFFECT': '保单生效',
            'TOBEPAID': '待支付',
            'INSURE': '已投保',
            'CALC': '试算成功',
            'DELETE': '删除',
            'SUBMIT': '已提交'
        },
        orderStatus_refresh: ['TOBEPAID', 'INSURE', 'SUBMIT'],
        entryPolicyStatus: {
            '0': '删除',
            '1': '正常'
        },
        newBizReform: { //新车商改地区
            '450000': 'Y', //广西
            '230000': 'Y', //黑龙江
            '370000': 'Y', //山东
            '610000': 'Y', //陕西
            '500000': 'Y', //重庆
            '120000': 'Y', //天津
            '150000': 'Y', //内蒙古
            '220000': 'Y', //吉林
            '340000': 'Y', //安徽
            '410000': 'Y', //河南
            '420000': 'Y', //湖北
            '430000': 'Y', //湖南
            '440000': 'Y', //广东
            '510000': 'Y', //四川
            '630000': 'Y', //青海
            '640000': 'Y', //宁夏
            '650000': 'Y' //新疆
        },

        provincesShort: [{
            code: 110000,
            fullName: '北京',
            shortName: '京'
        }, {
            code: 120000,
            fullName: '天津',
            shortName: '津'
        }, {
            code: 310000,
            fullName: '上海',
            shortName: '沪'
        }, {
            code: 500000,
            fullName: '重庆',
            shortName: '渝'
        }, {
            code: 150000,
            fullName: '内蒙古自治区',
            shortName: '蒙'
        }, {
            code: 650000,
            fullName: '新疆维吾尔自治区',
            shortName: '新'
        }, {
            code: 540000,
            fullName: '西藏自治区',
            shortName: '藏'
        }, {
            code: 640000,
            fullName: '宁夏回族自治区',
            shortName: '宁'
        }, {
            code: 450000,
            fullName: '广西壮族自治区',
            shortName: '桂'
        }, {
            code: 810000,
            fullName: '香港特别行政区',
            shortName: '港'
        }, {
            code: 820000,
            fullName: '澳门特别行政区',
            shortName: '澳'
        }, {
            code: 230000,
            fullName: '黑龙江省',
            shortName: '黑'
        }, {
            code: 220000,
            fullName: '吉林省',
            shortName: '吉'
        }, {
            code: 210000,
            fullName: '辽宁省',
            shortName: '辽'
        }, {
            code: 140000,
            fullName: '山西省',
            shortName: '晋'
        }, {
            code: 130000,
            fullName: '河北省',
            shortName: '冀'
        }, {
            code: 630000,
            fullName: '青海省',
            shortName: '青'
        }, {
            code: 370000,
            fullName: '山东省',
            shortName: '鲁'
        }, {
            code: 410000,
            fullName: '河南省',
            shortName: '豫'
        }, {
            code: 320000,
            fullName: '江苏省',
            shortName: '苏'
        }, {
            code: 340000,
            fullName: '安徽省',
            shortName: '皖'
        }, {
            code: 330000,
            fullName: '浙江省',
            shortName: '浙'
        }, {
            code: 350000,
            fullName: '福建省',
            shortName: '闽'
        }, {
            code: 360000,
            fullName: '江西省',
            shortName: '赣'
        }, {
            code: 430000,
            fullName: '湖南省',
            shortName: '湘'
        }, {
            code: 420000,
            fullName: '湖北省',
            shortName: '鄂'
        }, {
            code: 440000,
            fullName: '广东省',
            shortName: '粤'
        }, {
            code: 460000,
            fullName: '海南省',
            shortName: '琼'
        }, {
            code: 620000,
            fullName: '甘肃省',
            shortName: '甘'
        }, {
            code: 610000,
            fullName: '陕西省',
            shortName: '陕'
        }, {
            code: 520000,
            fullName: '贵州省',
            shortName: '黔'
        }, {
            code: 530000,
            fullName: '云南省',
            shortName: '滇'
        }, {
            code: 510000,
            fullName: '四川省',
            shortName: '川'
        }],
        processStatus: {
            'STAYDIS': '待分配',
            'RECEPTION': '待接收',
            'TREAT': '待处理',
            'PROCESSING': '处理中',
            'POSTHANDLE': '后置处理',
            'RENEWFAILD': '续保失败',
            'TERMINA': '续保终止',
            'SUCCEED': '续保成功'
        },
        taskStatus: {
            'CREATE': '任务生成',
            'ASSIGN': '任务分配',
            'ACCEPT': '任务接收',
            'MANAGE': '任务处理',
            'ALERT': '再次提醒',
            'DEFEAT': '战败登记',
            'END': '任务结束',
            'SUCCEED': '投保成功'
        },
        disUser: {
            'JIANGSU': '江苏',
            'SHANDONG': '山东',
            'GUANGXI': '广西'
        },
        effectDateScope: {
            'NINETYCYCLE': '90天周期',
            'SIXTYCYCLE': '60天周期',
            'FORTYFIVECYCLE': '45天周期',
            'THIRTYCYCLE': '30天周期',
            'NOW': '今天'
        },
        defeatRegistrationType: {
            'INSURANCE': '已投保',
            'NOTINSURETIME': '未到投保期',
            'OTHER': '其他'
        },
        visitType: {
            'PHONEVISIT': '电话拜访',
            'MESSAGEVISIT': '短信拜访',
            'MAILVISIT': '邮箱拜访',
            'FACEVISIT': '当面拜访'
        },
        visitPhase: {
            'FIRTSVISIT': '初次拜访',
            'BOOKVISIT': '预约拜访',
            'INSURANCECONFIRM': '售后拜访',
            'CUSTOMERVISIT': '售后拜访',
            'FRIENDSHIPCARE': '友情关怀'
        },
        customerSource: {
            'INSURANCECOMPANPUSH': '保险公司推送'
        },
        functionLayout: {
            home: ['newVehByMarketing', 'newVehByByInsurer', 'queryPolicy', 'cadillacRenewEntry', 'policyRecord', 'policyEntryQuery', 'repairRecord', 'repairEntryQuery', 'docManagement', 'policyReport', 'reportCoverage'],
            newveh: ['newVehByMarketing', 'newVehByByInsurer']
        },
        sgFloating: [{
            code: 'nonClaimDiscountRate',
            name: '无赔款折扣系数',
            disabled: true,
            num: 1.00
        }, {
            code: 'underWritingRate',
            name: '自主核保系数',
            disabled: true,
            num: 1.00
        }, {
            code: 'channelRate',
            name: '自主渠道系数',
            disabled: true,
            num: 1.00
        }, {
            code: 'trafficTransgressRate',
            name: '交通违法系数',
            disabled: true,
            num: 1.00
        }],
        floating: [{
            code: 'multipleCoveragesRate',
            name: '多险种优惠系数',
            disabled: false,
            num: 1.00
        }, {
            code: 'driveMileageRate',
            name: '行驶里程系数',
            disabled: false,
            num: 1.00
        }, {
            code: 'driveAreaRate',
            name: '行驶区域系数',
            disabled: false,
            num: 1.00
        }, {
            code: 'namedDrvierRate',
            name: '指定驾驶员系数',
            disabled: false,
            num: 1.00
        }, {
            code: 'customLoyaltyRate',
            name: '客户忠诚系数',
            disabled: true,
            num: 1.00
        }, {
            code: 'nonClaimDiscountRate',
            name: '无赔款折扣系数',
            disabled: true,
            num: 1.00
        }, {
            code: 'trafficTransgressRate',
            name: '交通违法系数',
            disabled: true,
            num: 1.00
        }],
        opinionType: {
            '1': '功能问题',
            '2': '用户体验',
            '3': '功能改进',
            '4': '新增功能',
            '99': '其它'
        },
        unpolicyType: {
            'CALC_EXCEPTION': '通过DIM系统无法完成报价或报价错误',
            'SUBMIT_EXCEPTION': '通过DIM系统提交的保单被保险公司拒保或删除，无法支付',
            'CONTENT_ERROR': '通过DIM系统提交的保单信息或内容不正确，无法承保',
            'NO_SPECIAL_CLAUSE': '无所需特约',
            'OTHER': '其它'
        },
        lastPolicyMode: {
            'INSURER_POLICY': '由保险公司人员重新出单',
            'CUSTOMER_POLICY': '由店内人员在保险公司系统上操作重新出单',
            'OTHER': '其它'
        },
        entryMarket: {
            'CADILLAC-RENEW': '凯迪拉克续保促销活动'
        },
        shortEntryMarket: {
            'CADILLAC-RENEW': '凯续'
        },
        accountBank: {
            '1': '中国工商银行',
            '2': '中国农业银行',
            '3': '中国银行',
            '4': '中国建设银行',
            '5': '交通银行',
            '6': '中信银行',
            '7': '中国光大银行',
            '8': '华夏银行',
            '9': '中国民生银行',
            '10': '招商银行',
            '11': '兴业银行',
            '12': '广发银行',
            '13': '平安银行',
            '14': '上海浦东发展银行',
            '15': '恒丰银行',
            '16': '浙商银行',
            '17': '渤海银行',
            '18': '中国邮政储蓄银行',
            '9999': '其它'
        },
        commissionSettlement: {
            '1': '不通过第三方',
            '2': '行业协会',
            '3': '中介平台'
        },
        accountType: {
            'SERVICE': '服务费',
            'CONSULTING': '咨询费'
        },
        approvalStatus: {
            'INIT': '待审核',
            'DOING': '审核中',
            'PASS': '审核通过',
            'BACK': '审核退回'
        },
        payStatus: {
            'INIT': '未支付',
            'PAYING': '支付中',
            'PAID': '支付完成',
            'FAILED': '支付失败'
        },
        transType: {
            'SAVE_FEE': '营销活动费用发放',
            'SAVE_COMMISSION': '佣金发放',
            'WITHDRAW': '提现'
        },
        equipmentOrigin: {
            'DOMESTIC': '国产',
            'JOINT': '合资',
            'IMPORTED': '进口'
        },
        drivingCarType: {
            'A': 'A证',
            'B': 'B证',
            'C': 'C证'
        },
        sex: {
            'MALE': '男',
            'FEMAIL': '女'
        }
    };
}.call(window.insaic, window.jQuery);