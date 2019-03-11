<template>
  <div>
    <x-header class="x-header-fix" slot="header" style="position: absolute;width:100%;left:0;top:0;z-index:100;">{{$store.state.pageInf.title}}<a slot="right" @click="moreMenus">更多</a></x-header>
    <div class="content-wrap">
      <group>
        <datetime  required v-model="form.beginTime" format="YYYY-MM-DD HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>开始时间</div></datetime>
      </group>
      <group>
        <datetime  required v-model="form.endTime" format="YYYY-MM-DD HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>结束时间</div></datetime>
      </group>
      <group>
        <x-number class="x-number-opt" title="时长(天)" :min="0" required :step="0.25" v-model="form.days" ></x-number>
      </group>
      <group>
        <x-input   required  v-model="form.targetName" ><div class="input-title" slot="label"><i class="require-star">*</i>客户名称</div></x-input>
      </group>
      <group>
        <x-input   required  v-model="form.address" ><div class="input-title" slot="label"><i class="require-star">*</i>外出地址</div></x-input>
      </group>
      <group>
        <x-textarea  required  v-model="form.memo" :max="200" name="description" :rows="3" :cols="30" ><div class="input-title" slot="label"><i class="norequire-star"></i>事宜内容</div></x-textarea>
      </group>
      <group>
        <x-button   @click.native="addTravel" :mini="true" type="primary">添加一条行程</x-button>
      </group>

      <div v-if="ifTravel">
        <div v-for="(item,index) in form.travels" :key="index" >
          <group >
            <x-button :mini="true" @click.native="delTravel(index)" type="warn">删除本条行程</x-button>
            <x-input  title="订票人姓名"   v-model="item.staffName" ></x-input>
            <x-input  title="订票人身份证"   v-model="item.staffIdcard" ></x-input>
            <x-input  title="订票人手机号"   v-model="item.staffTel" ></x-input>
            <x-input  title="始发地"   v-model="item.origin" ></x-input>
            <x-input  title="目的地"   v-model="item.destination" ></x-input>
            <x-input  title="去程信息"   v-model="item.toInfo" ></x-input>
            <x-input  title="返程信息"   v-model="item.returnInfo" ></x-input>
            <x-input  title="酒店名称"   v-model="item.hotelName" ></x-input>
            <x-input  title="酒店地址"   v-model="item.hotelAddress" ></x-input>
            <datetime title="计划入住时间"  v-model="item.hotelCheckinStr" format="YYYY-MM-DD HH:mm"  :minute-list="['00', '15', '30', '45']" ></datetime>
            <x-input  title="申请人姓名"   v-model="item.applicant" ></x-input>
            <x-input  title="承办人姓名"   v-model="item.worker" ></x-input>
            <x-textarea title="备注"   v-model="item.memo" :max="200" name="description" :rows="3" :cols="30" ></x-textarea>
          </group>
        </div>
      </div>


      <group>
          <x-button :disabled="isSubmitDisabled" @click.native="save" type="primary">提交</x-button>
      </group>
      <div>
        <ul id="error-msg"><li v-for="err in errors" v-text="err"></li></ul>
      </div>
      <actionsheet v-model="popMenuShow" :menus="popMenus" @on-click-menu="clickMenu" show-cancel></actionsheet>

    </div>
  </div>
</template>
<script>
import { Actionsheet,PopupPicker,Datetime, Group,XInput, XButton, XTextarea, XNumber } from 'vux'
import {saveVisit } from "../../api/mba";
import {ifExpire} from "../../api/login";
export default {
    components: {
    Group,
    Actionsheet,
    XButton,
    XInput,
    XTextarea,
    XNumber,
    Datetime,
    PopupPicker

    },
    data: function () {
      return {
        isSubmitDisabled:false,
        listPath:'/mba/visitMyList',
        ifTravel:true,
        popMenuShow:false,
        popMenus:{menu1:"查看记录"},
        form:{
          visitType:['1'],
          beginTime:'',
          endTime:'',
          days: 0.25,
          targetName:'',
          address:'',
          memo:'',
          travels:[],
        },
      }
  },
  vuerify: {
    'form.beginTime': {test: /\S{1,}/, message: '开始时间输入不正确'},
    'form.endTime': {
      test(){
        if (this.form.endTime != '' && this.form.endTime > this.form.beginTime) {
          return true;
        } else {
          return  false;
        }
        return false
      },
      message:'结束时间输入不正确'
    },
    'form.targetName':{test: /^\S{1,200}$/, message: '客户名称必须输入,少于200字'},
    'form.address':{test: /^\S{1,200}$/, message: '拜访地点必须输入,少于200字'},
  },
  mounted: function () {
    this.initData();
  },
  computed: {
    errors () {
      return this.$vuerify.$errors
    },
    invalid () {
      return this.$vuerify.invalid
    }

  },
  methods: {
    initData: function () {
      ifExpire().then(res=>{});//登录联通性测试
    },
    addTravel(){
      let travelObj = {
        staffName: '',
      }
      this.form.travels.push(travelObj);
    },
    delTravel(index){
      this.form.travels.splice(index,1);
    },
    save(){
      if (this.$vuerify.check()) {
        this.isSubmitDisabled = true;
        saveVisit(this.form).then(res=>{
           this.$vux.toast.text('保存成功', 'top')
          this.$router.replace({path:this.listPath});
          this.isSubmitDisabled = false;
         });
      }



    },
    clickMenu(key,item){
      if(key === 'menu1'){
        this.$router.push({path:this.listPath});
      }

    },
    moreMenus(){
      this.popMenuShow=true;
    }

 }
}
</script>




