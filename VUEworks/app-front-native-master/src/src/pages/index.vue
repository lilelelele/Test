<template>
  <div id="index" style="height:100%;">
    <view-box ref="viewBox">
       <router-view></router-view>
      <tabbar slot="bottom" style="position: fixed">
          <tabbar-item selected link="/home/homeMain/0">
            <img slot="icon"  src="../assets/icon_nav_button.png">
            <span slot="label">首页</span>
          </tabbar-item>
        <tabbar-item   link="/work/moduleList">
          <img slot="icon"  src="../assets/icon_nav_article.png" >
          <span slot="label">工作</span>
        </tabbar-item>

          <tabbar-item link="/my/myCenter">
            <img slot="icon" src="../assets/icon_nav_cell.png"  >
            <span slot="label">我的</span>
          </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>
<script>




  import{logout,getLoginName,ifLogin} from "../api/login";
  import { ViewBox,Tabbar, TabbarItem } from 'vux';




  export default {
    components: {
      Tabbar,
      TabbarItem,
      ViewBox,

    },

    data:function(){
      return{
        pageTitle:this.$store.state.pageInf.title,
        msg: 'LOGO',

        menuList:[
          {name:'',link:''}
        ],
        selected:"tab1",

      }
    },
    mounted: function(){
      this.initData();
      ifLogin();
      //this.$router.replace({path: '/home/homeMain'});
      //this.pageTitle = this.$store.state.pageInf.title;
    },
    computed: {
      getPageTitle() {
        return this.$store.state.pageInf.title;
      }
    },
    watch:{
      getPageTitle(val) {
        this.pageTitle = val;
      },
    },
    methods: {
      initData:function(){
        console.log("3333333333333333");


        //this._listMenu();
        //console.log("this.$vux",this.$vux);
        //this.$vux.toast.text('hello', 'top')

      },
      exitLogin: function(){//退出登录
        logout().then(res=>{
          //this.$router.push({path: '/login'});
        });
      }

    }
  }
</script>



