/**
 * 具体模块的入口js，推荐每个页面的body对应一个module，具体请参照对应模块的html的data-module-path属性
 * module元素上还可以设置data-interceptor-path属性，为初始化具体模块之前做一些业务处理
 */

define(function (require, exports) {
    'use strict';

    var service = require('service/task-list');

    require('tpl!/tpl/task-list.tpl');

    // 页面中的子模块需要手动require进来，打包时分析依赖用
    require('./sub-module-1');
    require('./sub-module-2');
    require('./interceptor/base-data');
    require('./instance-demo');

    // 事件管理器，页面内共享
    var eventEmitter = require('common/eventEmitter');

    var moduleNode;

    exports.init = function (interceptorData) {

        console.log('模块能获取对应的interceptor的返回值：', interceptorData);

        // 模块元素，查找元素都要基于此元素，目的是防止干扰其他模块
        moduleNode = this.element;

        var module1Data = this.data;

        moduleNode.on('click', '.main', function () {
            console.log('module main clicked');
            exports.dispose();
        });

        eventEmitter.on('sub2-clicked', function (data) {
            alert(data.id);
        });

        moduleNode.find('div').data('ip', interceptorData.ip);

        // 可以返回一个Deferred来延迟初始化此模块下面的所有模块
        return service.getTaskList(
            {
                holder: moduleNode
            }
        ).done(function (resp) {
            console.log('这个是获取到的taskList数据，', resp);
        });
    };

    exports.dispose = function () {
        console.log('dispose task-list/main');
    };
});