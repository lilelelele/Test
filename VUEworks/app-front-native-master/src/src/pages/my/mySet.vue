<template>
  <div>
    <x-header class="x-header-fix" slot="header" style="position: absolute;width:100%;left:0;top:0;z-index:100;">{{$store.state.pageInf.title}}</x-header>
    <div class="home-wrap">

      <div class="welcome-info" >模块正在开发中</div>
    </div>
  </div>
</template>
<script>
  import{listMenu} from "../../api/work";

  export default {
    data:function(){
      return{
        msg: 'LOGO',
      }
    },
    mounted: function(){
      this.initData();
    },
    computed: {

    },
    methods: {
      initData:function(){
      },
    }
  }
</script>

<style>

</style>


