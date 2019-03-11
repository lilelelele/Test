<template>
  <div id="myVideo">



    <div v-if="!cordova" class="alert">
      There might be an error with your installation. Check that <strong>Vue.cordova</strong> is available
    </div>

    <div v-if="cordova && !cordova.deviceready" class="alert">
      The `deviceready` event has not been triggered.
      <br />
      Check the <a href="https://github.com/kartsims/vue-cordova#troubleshooting">Troubleshooting section</a> of vue-cordova's README.
    </div>

    <div class="indicators">
      <div :class="{ ok: cordova.deviceready }">
        <span></span>deviceready
      </div>
      <div v-for="(pluginTest, plugin) in plugins" :class="{ ok: pluginEnabled(plugin) }" @click="pluginTest">
        <span></span>{{ plugin }}
      </div>
      <p>
        Click a plugin name to run a simple test
      </p>
    </div>

    <h2>`Vue.cordova`</h2>

    <div class="dump" v-if="cordova">{{ cordova }}</div>
    <h2> ori  cordova plugin</h2>

    <x-button  @click.native="getposition" type="primary">获取位置</x-button>
    <x-button  @click.native="getMedia" type="primary">获取录像</x-button>
    <h2>{{msg}}</h2>


  </div>
</template>
<script>
  import Vue from 'vue'
  import {   XButton } from 'vux'

  export default {
    components: {
      XButton,
    },
    data: function () {
      return {
        cordova: Vue.cordova,
        msg:'INfO',
        plugins: {
          'cordova-plugin-camera': function () {
            if (!Vue.cordova.camera) {
              window.alert('Vue.cordova.camera not found !')
              return
            }
            Vue.cordova.camera.getPicture((imageURI) => {
              window.alert('Photo URI : ' + imageURI)
            }, (message) => {
              window.alert('FAILED : ' + message)
            }, {
              quality: 50,
              destinationType: Vue.cordova.camera.DestinationType.FILE_URI
            })
          },
          'cordova-plugin-media-capture': function () {
            if (!Vue.cordova.camera) {
              window.alert('Vue.cordova.camera not found !')
              return
            }
            Vue.cordova.camera.getPicture((imageURI) => {
              window.alert('Photo URI : ' + imageURI)
            }, (message) => {
              window.alert('FAILED : ' + message)
            }, {
              quality: 50,
              destinationType: Vue.cordova.camera.DestinationType.FILE_URI
            })
          },
          'cordova-plugin-device': function () {
            if (!Vue.cordova.device) {
              window.alert('FAILED : device information not found')
            } else {
              window.alert('Device : ' + Vue.cordova.device.manufacturer + ' ' + Vue.cordova.device.platform + ' ' + Vue.cordova.device.version)
            }
          },
          'cordova-plugin-geolocation': function () {
            if (!Vue.cordova.geolocation) {
              window.alert('Vue.cordova.geolocation not found !')
              return
            }
            Vue.cordova.geolocation.getCurrentPosition((position) => {
              window.alert('Current position : ' + position.coords.latitude + ',' + position.coords.longitude)
            }, (error) => {
              window.alert('FAILED Error #' + error.code + ' ' + error.message)
            }, {
              timeout: 1000,
              enableHighAccuracy: true
            })
          },
          'cordova-plugin-contacts': function () {
            if (!Vue.cordova.contacts) {
              window.alert('Vue.cordova.contacts not found !')
              return
            }
            const ContactFindOptions = ContactFindOptions || function () {}
            Vue.cordova.contacts.find(['displayName'], (contacts) => {
              window.alert('Contacts found : ' + contacts.length)
            }, (error) => {
              window.alert('FAILED : ' + error.code)
            })
          }
        }
      }
    },
    methods: {

      pluginEnabled: function (pluginName) {
        return this.cordova.plugins.indexOf(pluginName) !== -1
      },
      initData:function(){
      },
      // capture(){
      //   //duration参数为最长录制时间
      //   navigator.device.capture.captureVideo(this.captureOnSuccess, this.captureOnError, {duration: 20});
      // },
      // captureOnSuccess(){
      //   var i, path, len;
      //   for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      //     path = mediaFiles[i].fullPath;
      //     alert("success\n" +
      //       "name：" + mediaFiles[i].name + "\n" +
      //       "size：" + mediaFiles[i].size + "\n" +
      //       "localURL：" + mediaFiles[i].localURL + "\n" +
      //       "fullPath：" + path);
      //   }
      //
      // },
      // captureOnError(){
      //   console.log(error)
      //   alert('error' + error);
      // },
      getposition:function()
      {
        let val = 1;
        console.log("getposition");
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

        console.log("getposition22");

        navigator.geolocation.getCurrentPosition(onSuccess, error,{maximumAge: 10000, timeout: 10000, enableHighAccuracy: val});
      },
      getMedia:function()
      {
        console.log("getMedia");

        // capture callback
        var captureSuccess = function(mediaFiles) {
          var i, path, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            alert("success\n" +
              "name：" + mediaFiles[i].name + "\n" +
              "size：" + mediaFiles[i].size + "\n" +
              "localURL：" + mediaFiles[i].localURL + "\n" +
              "fullPath：" + path);
          }
        };

// capture error callback
        var captureError = function(error) {
          console.log(error)
          alert('error' + error);
        };

// start video capture
        navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});


      },

    }
  }
</script>

<style scoped lang="scss">
  #myVideo {
    div.dump {
      background: #eee;
      text-align: left;
      border: solid 1px #ccc;
      padding: 20px;
      max-width: 600px;
      box-sizing: border-box;
      font-family: monospace;
      white-space: pre;
    }

    div.alert {
      color: #c00;
      font-weight: bold;
      font-size: .9em;
      padding-bottom: 30px;
      line-height: 1.6;
    }

    div.alert a {
      color: inherit;
    }

    div.indicators {
      width: 340px;
      margin: 0 auto 40px;
      text-align: left;
      font-family: Courier, Courier New, sans-serif;
    }

    div.indicators div {
      padding-bottom: 15px;
      opacity: .6;
    }

    div.indicators div.ok {
      opacity: 1;
      cursor: pointer;
    }

    div.indicators div.ok span {
      background: #0c0;
    }

    div.indicators div span {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #c00;
      border-radius: 20px;
      position: relative;
      top: 3px;
      margin-right: 15px;
    }

    div.indicators p {
      font-size: .8em;
      font-weight: bold;
      padding-bottom: 20px;
    }

  }

</style>


