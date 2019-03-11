"use strict";

export default (function(){
    let that = {

        // 检查是否是cordova环境
        isCordova() {
            let platform = window.navigator.platform.toLowerCase();
            if (platform.startsWith('linux') || 'iphone' === platform || 'ipad' === platform) {
                return true;
            };
            return false;
        }
    };

    // 写入cordova.js
    (function () {
        if (that.isCordova()) {
            let [head, script] = [document.getElementsByTagName('head')[0], document.createElement('script')];
            script.type = 'text/javascript';
            script.src = 'cordova.js';
            head.appendChild(script);
        };
    })();

    return that;

})();