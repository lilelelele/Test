import {axios,urlencodedHeader,jsonHeader} from '../config'

//退出登录
export function test(){//退出登录
    var versionCheckUrl = "http://api.fir.im/apps/latest/com.mbtst.oa?api_token=12169ca0253feb76505ee8a9fa5cdc8f&type=ios";
    var isActive = false;
    axios.get(versionCheckUrl,{withCredentials: false}).then(result =>{
        console.log(">>>>fy>>>>checkPrdAndUpate get versionCheckUrl result",result);
        console.log(">>>>fy>>>>checkPrdAndUpate get versionCheckUrl result",result.data.versionShort);

    if(result.data.versionShort > '0.0.1' ){

        //this.showConfirmUpdate(result.update_url);
        window.vm.$vux.confirm.show({
            title: '下载提示',
            content: '有新版本，确定现在下载么?',
            onCancel () {
                console.log('plugin cancel')
            },
            onConfirm () {
                console.log('plugin confirm')
                cordova.InAppBrowser.open('http://www.baidu.com', '_system', 'location=no');
            }
        });
    }else{
        if(isActive){

            //   this.showAlertNewVersion();
            //测试完成后删掉
            // this.showToast("后台API:" + this.config.apiUrl + "升级检测地址:"+versionCheckUrl)
        }
    }
    });
};

//检查APP 环境及是否要升级
export function checkPrdAndUpate(isActive){
    window.vm.$vux.toast.text('正在执行升级检验', 'top')
    console.log(">>>>fy>>>>checkPrdAndUpate in");
    Promise.all([cordova.getAppVersion.getPackageName(),cordova.getAppVersion.getVersionNumber()]).then(value => {
        console.log(">>>>fy>>>>checkPrdAndUpate promise in");
        let [packageName, versionNumber] = value;
        var  versionCheckUrl;
        console.log(">>>>fy>>>>checkPrdAndUpate ios check ");
        if(isIos()){
            console.log(">>>>fy>>>>checkPrdAndUpate ios 1 ");
            if(isTest(packageName)){
                versionCheckUrl = URL_IOS_CHECK_VERSION_DEV;
            }else{
                versionCheckUrl = URL_IOS_CHECK_VERSION_PRD;
            }
        }else{  //android
            console.log(">>>>fy>>>>checkPrdAndUpate android 1");
            if(isTest(packageName)){
                versionCheckUrl = URL_ANDROID_CHECK_VERSION_DEV;
            }else{
                versionCheckUrl = URL_ANDROID_CHECK_VERSION_PRD;
            }
        }
        console.log(">>>>fy>>>>checkPrdAndUpate versionCheckUrl",versionCheckUrl);

        axios.get(versionCheckUrl,{withCredentials: false}).then(result=>{
            console.log(">>>>fy>>>>checkPrdAndUpate get versionCheckUrl result",result);

            if(result.data.versionShort > versionNumber ){

                //this.showConfirmUpdate(result.update_url);
                window.vm.$vux.confirm.show({
                    title: '下载提示',
                    content: '有新版本，确定现在下载么?',
                    onCancel () {
                        console.log('plugin cancel')
                    },
                    onConfirm () {
                        console.log('plugin confirm')
                        cordova.InAppBrowser.open(result.data.update_url, '_system', 'location=no');
                    }
                });
            }else{
                if(isActive){

                 //   this.showAlertNewVersion();
                    //测试完成后删掉
                    // this.showToast("后台API:" + this.config.apiUrl + "升级检测地址:"+versionCheckUrl)
                }
            }
        });
    });
};





/**
 * 是否测试包
 * @return {boolean}
 */
export function isTest(packageName) {
    if(packageName.indexOf("mbprd") > 0){//如果包名含有wdrcloud，则是正式包
        return false
    }
    return true
}


/**
 * 是否android真机环境
 * @return {boolean}
 */
export function isAndroid() {
//    return this.isMobile() && this.platform.is('android');
    if (device.platform === 'android'){
      return true;
    }
    return false;

}
/**
 * 是否ios真机环境
 * @return {boolean}
 */
export function isIos() {
   // return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    if (device.platform === 'iOS' || device.platform === 'ipad' || device.platform === 'iphone'){
        return true;
    }
    return false;
}



/*
 * ios检测版本地址--测试
 */
const  URL_IOS_CHECK_VERSION_DEV = "http://api.fir.im/apps/latest/com.mbtst.oa?api_token=12169ca0253feb76505ee8a9fa5cdc8f&type=ios";
/*
 * ios检测版本地址--正式
 */
const URL_IOS_CHECK_VERSION_PRD = "http://api.fir.im/apps/latest/com.mbprd.oa?api_token=12169ca0253feb76505ee8a9fa5cdc8f&type=ios";
/*
 * android检测版本地址--测试
 */
const URL_ANDROID_CHECK_VERSION_DEV = "http://api.fir.im/apps/latest/com.mbtst.oa?api_token=12169ca0253feb76505ee8a9fa5cdc8f&type=android";
/*
 * android检测版本地址--正式
 */
const URL_ANDROID_CHECK_VERSION_PRD = "http://api.fir.im/apps/latest/com.mbprd.oa?api_token=12169ca0253feb76505ee8a9fa5cdc8f&type=android";
//end --update check version