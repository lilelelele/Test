"use strict";

import env from './env'

export default (function(){

    (function() {
        console.log('init');
        if(env.isCordova()){
            document.addEventListener("deviceready", initJpush, false);
            document.addEventListener("jpush.openNotification", onOpenNotification, false);
        };
    })();

    // 初始化jpush
    function initJpush(){
        console.log('initJpush');
        try {
            window.JPush.setDebugMode(true);
            window.JPush.init();
            window.setTimeout(getRegistrationID, 1000);
            if (device.platform != "Android") {
                window.JPush.setApplicationIconBadgeNumber(0);
            };
        } catch (error) {
            // 持续挂载，直到挂载上为止
            setTimeout(() => {
                initJpush();
            }, 50);
        };
    }

    // 获取id
    function getRegistrationID() {
        console.log('getRegistrationID');
        window.JPush.getRegistrationID(onGetRegistrationID)
    };

    // jpush回调
    function onGetRegistrationID(data) {
        console.log('onGetRegistrationID');
        try {
            if (data.length === 0) {// 没有获取到getRegistrationID
                window.setTimeout(getRegistrationID, 1000);
                console.log('jpush egister ID : null~');
            } else {// 获取到getRegistrationID
                console.log('jpush egister ID : ' + data);
            }
        } catch (error) {
            console.error('onGetRegistrationID error:' + error);
        };
    };

    // 点击推送通知app反馈
    function onOpenNotification(event) {
        console.log('点击推送反馈>>>>>>>>>>');
        console.log(JSON.stringify(event));
        try {
            let that = window.vm, alertContent, param = {};// 推送的消息内容
            param = event.extras;

            // 类型为1时，则跳转链接
            if (1 === Number(param.open_type)) {
                that.$router.push(param.open_url);
            };
        } catch (exception) { };
    };

    return {
        // 设置别名
        setAlias(_sequence, _alias, _success, _error){
            if (window.JPush){
                window.JPush.setAlias({ sequence: _sequence, alias: _alias }, res => {
                    'function' === typeof _success ? _success(res) : console.log(res);
                }, err => {
                    'function' === typeof _error ? _error(err) : console.log(err)
                });
            } else {
                console.log('别名设置失败：Jpush尚未挂载成功！');
            };
        }
    };

})();