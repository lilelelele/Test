<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    </router-view>


  </div>
</template>

<script>
  import Vue from 'vue'
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  export default {
    name: 'App',
    components: {
      Loading
    },
    data(){
      return {
        loadText:"loading",
      }
    },
    created(){
      console.log('app created>>>>>>>>>>>>>>>>>')


    },
    computed:{
    },
    beforeRouteEnter(to,from,next){
        if(!sessionStorage.askPositon || from.path == '/'){//当前页面刷新不需要切换位置
            sessionStorage.askPositon = '';
            next();
        }else{
            next(vm => {
                if(vm && vm.$refs.my_scroller){//通过vm实例访问this
                    setTimeout(function () {
                        console.log("sessionStorage.askPositon2",sessionStorage.askPositon)
                        vm.$refs.my_scroller.scrollTo(0, sessionStorage.askPositon, true);
                    },0)//同步转异步操作
                }
            })
        }
    },
    beforeRouteLeave(to,from,next){//记录离开时的位置
        console.log("beforeRouteLeave")
        sessionStorage.askPositon = this.$refs.my_scroller && this.$refs.my_scroller.getPosition() && this.$refs.my_scroller.getPosition().top;
        console.log("sessionStorage.askPositon1",sessionStorage.askPositon)
        next()
    }
  }
</script>

<style>
  html, body, #app{
		width: 100%;
		height: 100%;
		line-height: normal;
		font-size: 14px;
		font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	}

	#app .weui-mask_transparent{
		background: rgba(0,0,0,.5);
	}
</style>