<template>
  <div>
    <x-header class="x-header-fix" slot="header" style="position: absolute;width:100%;left:0;top:0;z-index:100;">{{$store.state.pageInf.title}}<a slot="right" @click="moreMenus">更多</a></x-header>
      <div class="content-wrap">
        <group>
            <datetime  required v-model="form.beginTime" format="YYYY-MM-DD HH:mm"  :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>开始时间</div></datetime>
        </group>
        <group>
            <datetime  required v-model="form.endTime" format="YYYY-MM-DD HH:mm"  :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>结束时间</div></datetime>
        </group>
        <group>
            <x-number class="x-number-opt" title="时长(天)" :min="0" required :step="0.125" v-model="form.days" ></x-number>
        </group>
        <group>
            <x-textarea  title="1"   v-model="form.memo" :max="200" name="description" :rows="3" :cols="30" ><div class="input-title" slot="label"><i class="require-star">*</i>加班事由</div><</x-textarea>
        </group>
        <group>
            <x-input  title="1"   v-model="form.address" :max="200"><div  class="input-title" slot="label"><i class="require-star">*</i>加班地点</div></x-input>
        </group>
        <group>
            <x-button :disabled="isSubmitDisabled" @click.native="save" type="primary">提交</x-button>
        </group>
        <actionsheet v-model="popMenuShow" :menus="popMenus" @on-click-menu="clickMenu" show-cancel></actionsheet>
        <ul id="error-msg"><li v-for="err in errors" v-text="err"></li></ul>
      </div>
  </div>
</template>
<script>
import { Actionsheet,PopupPicker,Datetime, Group, XButton,XInput, XTextarea, XNumber } from 'vux'
import {saveOvertime } from "../../api/mba";
import {ifExpire} from "../../api/login";
import {WF_NAMESPACE} from "../../config.js";
export default {
    components: {

    Group,
    XButton,
    Actionsheet,
    XTextarea,
    XInput,
    XNumber,
    Datetime,
    PopupPicker

    },
    data: function () {
      return {
        isSubmitDisabled:false,
        listPath:'/mba/overtimeMyList',
        popMenuShow:false,
        popMenus:{menu1:"查看记录"},
        form:{
          leaveTypes:['1'],
          beginTime:'',
          endTime:'',
          address:'',
          days: 0.125,
          memo:'',
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
    'form.memo':{test: /^\S{1,200}$/, message: '加班事由必须输入,少于200字'},
    'form.address':{test: /^\S{1,200}$/, message: '加班地点必须输入,少于200字'},

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
    save(){
      if (this.$vuerify.check()) {
        this.isSubmitDisabled = true;
        saveOvertime(this.form).then(res=>{
          this.$vux.toast.text('保存成功', 'top')
          this.$router.replace({path:this.listPath});
          this.isSubmitDisabled = false
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




