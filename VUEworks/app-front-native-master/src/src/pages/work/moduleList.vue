<template>
  <div>
    <divider> 日常工作组件</divider>
    <div class="m-group">
      <div class="m-item" @click="routerlink('/mba/leaveAdd')"><div><img src="../../assets/m-jia.png"/></div><div >请假</div></div>
      <div class="m-item" @click="routerlink('/mba/visitAdd')"><div><img src="../../assets/m-chu.png"/></div><div >外出申请</div></div>
      <div class="m-item" @click="routerlink('/mba/overtimeAdd')"><div><img src="../../assets/m-jiaban.png"/></div><div >加班</div></div>
    </div>
    <divider> 待办任务</divider>
    <div class="m-group">
      <div class="m-item" @click="routerlink('/mba/todoList')"><div><img src="../../assets/m-dai.png"/></div><div >待办任务</div></div>
      <div class="m-item" @click="routerlink('/mba/doneList')"><div><img src="../../assets/m-yi.png"/></div><div >已办任务</div></div>
    </div>
    <divider> 工作可视化</divider>
    <div class="m-group">
      <div v-auth="'app::dailyList'" class="m-item" @click="routerlink('/work/dailyList')"><div><img src="../../assets/m-ri.png"/></div><div >个人日报</div></div>
      <div v-auth="'app::contractList'" class="m-item" @click="routerlink('/contract/list')"><div><img src="../../assets/m-hetong.png"/></div><div >合同管理</div></div>
      <div v-auth="'app::dailyCheck'" class="m-item" @click="routerlink('/work/dailyCheck')"><div><img src="../../assets/m-shencha.png"/></div><div >日报审查</div></div>
    </div>


  </div>
</template>
<script>
  import { Divider } from 'vux'

  export default {
    components: {
      Divider
    },
    data:function(){
      return{

      }
    },
    mounted: function(){
      this.initData();
    },
    computed: {

    },
    methods: {
      initData:function(){
        console.log("this.$store.state.authList",this.$store.state.authList)
      },
      routerlink:function(url)
      {
        this.$router.push(url);
      }
    }
  }
</script>

<style>
  .m-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }
  .m-item{
    width: 110px;
    height: 110px;
  }
  .m-item>div{
    text-align: center;
  }
  .m-item>div img{
    width: 60px;
    height: 60px;
  }

.button
{
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ff0000;
  border-radius: 10px;
}

</style>


