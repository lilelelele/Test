<template>
  <div class="home-wrap">

    <div class="welcome-info" >模块正在开发中</div>
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


