<template>
  <div class="home-wrap">

    <div class="welcome-info" >{{getCurUserName()}},影谱驾到欢迎您的到来</div>







  </div>
</template>
<script>

  var inAppUrl='';
  window.handleOpenURL = function(url){
    setTimeout(function(){
      let as = url.split("://")
      window.vm.$router.push({path: as[1]})
    },0);
  }

  import { Rater, Group, Cell, Range } from 'vux'
  import{checkAndAutoLogin} from "../../api/login";
  import{test,checkPrdAndUpate} from "../../api/update";
  import XButton from "vux/src/components/x-button/index";

  export default {
    components: {
      XButton,
      Rater,
      Group,
      Cell,
      Range
    },
    data:function(){
      return{
        forceAutoLogin: parseInt(this.$route.params.forceAutoLogin),
        data1: 0,
        imgsrc:'./static/logo.png',
        msg:'cordova not init',
        codeinfo:''

      }
    },
    activated(){
      console.log('我是-------->>>>>>>>>>>>>activated');
     // this.autoLogin();
    },


    mounted: function(){



      console.log('我是-------->>>>>>>>>>>>>mounted');

      let user = JSON.parse(localStorage.getItem("userJsonStr"));
      if(user) {
        this.$store.commit('setAuthList', user.permissionList || []);
      }

      console.log('this.$route.params',this.$route.params.forceAutoLogin);
      this.autoLogin();
      //test();
      this.initData();

      var that = this;
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
          console.log(">>>>>>>>>>>>>>>>>f>>>>>>>>>>>>> add cordova deviceready ok");
          console.log("device.platform:"+device.platform);
          console.log(navigator.device.capture);
          console.log(">>>>>>>>>>>>>>>>>f>>>>>>>>>>>>> add cordova deviceready ok222");
          that.msg="cordova is ready";
          checkPrdAndUpate();
      }


    },
    computed: {

    },
    methods: {
      initData:function(){
          // this.$vux.confirm.show({
          //     title: 'Title22',
          //     content: 'Content',
          //     onCancel () {
          //         console.log('plugin cancel')
          //     },
          //     onConfirm () {
          //         console.log('plugin confirm')
          //     }
          // })

      },
      autoLogin() {

        console.log("check , And ,AutoLogin",this.forceAutoLogin)
        checkAndAutoLogin(this.forceAutoLogin)
      },

      getCurUserName(){
        let userJsonStr = localStorage.getItem("userJsonStr");
        if(userJsonStr){
          let user = JSON.parse(userJsonStr);
          return user.nickname;
        }
        return "";


      },



  getInfo()
  {
      cordova.getAppVersion.getVersionNumber().then(function (version) {

          //alert('version: ' + version);
          this.$vux.toast.text('version:'+version, 'top')
      });
      cordova.getAppVersion.getVersionNumber().then(function (version) {

          //alert('version: ' + version);
          this.$vux.toast.text('version:'+version, 'top')
      });
      //cordova.InAppBrowser.open('http://www.baidu.com', '_system', 'location=no');
      console.log(device.platform);


  },
  getcode()
        {
            var that = this;
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    me.codeinfo="We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled;
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        },
        getimage()
        {
            var me= this;
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,sourceType:0 });

            function onSuccess(imageURI) {
                me.imgsrc = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        },
        getposition:function(val)
        {
            navigator.vibrate(500);
            var me = this;
            var onSuccess = function(position) {
                me.msg='Latitude:\t'          + position.coords.latitude          + '\n' +
                    'Longitude:\t'         + position.coords.longitude         + '\n' +
                    'Altitude:\t'          + position.coords.altitude          + '\n' +
                    'Accuracy:\t'          + position.coords.accuracy          + '\n' +
                    'Altitude Accuracy:\t' + position.coords.altitudeAccuracy  + '\n' +
                    'Heading:\t'           + position.coords.heading           + '\n' +
                    'Speed:\t'             + position.coords.speed             + '\n' +
                    'Timestamp:\t'         + position.timestamp                + '\n';
            };

            // onError Callback receives a PositionError object
            //
            var error= function(error) {
                me.msg='code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n';
            }

            navigator.geolocation.getCurrentPosition(onSuccess, error,{maximumAge: 30000, timeout: 30000, enableHighAccuracy: val});
        },

    }
  }
</script>

<style>




</style>


