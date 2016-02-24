/*
* @Author: dmyang
* @Date:   2015-08-31 21:17:45
* @Last Modified by:   dmyang
* @Last Modified time: 2015-09-14 14:54:37
*/

'use strict';

console.info('require page c.');

require('commonCss');

require('zepto');

// 直接使用npm模块
var _ = require('lodash');

var report = require('../../components/helpers/report');
var bar = require('../../components/helpers/bar');
var url = require('../../components/utils/url');
