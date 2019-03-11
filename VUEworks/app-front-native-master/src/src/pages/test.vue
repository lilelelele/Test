<template>
  <div>
    <div class="box1">
      <div class="item1">1</div>
      <div class="item2">
        <div>a1</div>
        <div>a1</div>
        <div>a1</div>
        <div>a1</div>
        <div>a1</div>
        <div>a1</div>
        <div>a1</div>

      </div>
      <div class="item3">3</div>

    </div>
  <br/>
    <div class="wrapper_flex">
      <div class="item11">1</div>
      <div class="item12">2</div>
      <div class="item13">3</div>
      <div class="item14">4</div>
      <div class="item15">5</div>
      <div class="item16">6</div>
    </div>


    <div class="flex-grid">
      <div>审批编号</div><div>1111111111111111111111111111111111111111111111111222222222222</div>
      <div>所在部门</div><div>111111111111</div>
      <div>请假类型</div><div>111111111111</div>
      <div>开始时间</div><div>111111111111</div>
      <div>结束时间</div><div>111111111111</div>
      <div>时长(天)</div><div>111111111111</div>
      <div>请假事由</div><div>111111111111</div>
    </div>


  </div>





</template>
<script>
  import{login} from "../api/login";
  import { XInput, Group, XButton, Cell } from 'vux'


  import { Alert,ToastPlugin } from 'vux'
  export default {
    name: 'login',
    components: {
      XInput,
      XButton,
      Group,
      Cell
    },
    data: function () {
      return {
        lastUrl:'',
        type: 'text',
        userForm:{
          username: '',
          password:'',

        },
        username: 'fy@moviebook.cn',
        password:'123456',
      }
    },
    vuerify: {
      username: 'email',
      password: {
        test: /\w{4,}/,
        message: '至少四位'
      },
    },
    beforeRouteEnter(to,from,next){
      debugger;
      console.log("from.path",from.path);

      next();
      next(vm => {
        // 通过 `vm` 访问组件实例,将值传入oldUrl
        vm.lastUrl = from.path
      })
    },
    computed:{
      errors () {
        return this.$vuerify.$errors
      },
      invalid () {
        return this.$vuerify.invalid
      }
    },
    mounted(){
      console.log("22lastUrl",this.lastUrl);
      // this.$nextTick(()=>{
      //   // 验证是否获取到了上页的url
      //   /* eslint-disable no-console */
      //   console.log("lastUrl",this.lastUrl);
      // })



    },
    methods: {

    }
  }
</script>
<style >

  .flex-grid div:nth-child(odd) {
    background-color: #10aeff;
    width: 100px;
  }
  .flex-grid div:nth-child(even) {
    width:200px;

  }

  .flex-grid {
    display: flex;
    flex-wrap: wrap;
  }







  .box1{
    display: flex;
    justify-content: space-between;
    height:200px;
  }
  .box1 div{


    border:1px red solid;
    text-align: center;

  }
  .box1>div:nth-child(1){
    background-color: #10aeff;

  }
  .item1{
    width:50px;

  }
  .item2 {
    flex-grow:1



  }
  .item3 {
    width:150px;

  }



  .wrapper_flex{
    display: flex;
    flex-wrap: wrap;
    width:300px;

  }
  .wrapper_flex div{
    width:100px;
    background-color: #0bb20c;
    height:100px;

    border:1px red solid;
    box-sizing:border-box;
    text-align: center;
  }
  .wrapper_flex .item11{
    width:200px;

  }
  .wrapper_flex .item13{
    height:200px;

  }
  .wrapper_flex .item14{
    width:200px;

  }





</style>
