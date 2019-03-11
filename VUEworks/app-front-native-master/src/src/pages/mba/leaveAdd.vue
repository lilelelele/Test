<template>
  <div>
    <x-header class="x-header-fix" slot="header" style="position: absolute;width:100%;left:0;top:0;z-index:100;">{{$store.state.pageInf.title}}<a slot="right" @click="moreMenus">更多</a></x-header>
      <div class="content-wrap">
        <group>
            <popup-picker  :data="vacationTypes" :columns="3" v-model="form.leaveTypes" show-name><div  slot="title"><i class="require-star">*</i>请假类型</div></popup-picker>
        </group>
        <group>
            <datetime  v-model="form.beginTime" format="YYYY-MM-DD HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>开始时间</div></datetime>
        </group>
        <group>
            <datetime  v-model="form.endTime" format="YYYY-MM-DD HH:mm" :hour-list="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minute-list="['00', '15', '30', '45']" ><div slot="title"><i class="require-star">*</i>结束时间</div></datetime>
        </group>
        <group>
            <x-number class="x-number-opt" title="时长(天)" :min="0" required :step="0.5" v-model="form.days" ></x-number>
        </group>
        <group>
            <x-textarea  required  v-model="form.memo" :max="200" name="description" :rows="3" :cols="30" ><div class="input-title" slot="label"><i class="norequire-star"></i>请假理由</div></x-textarea>
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
import { Actionsheet,PopupPicker,Datetime, Group, XButton, XTextarea, XNumber } from 'vux'
import {saveLeave } from "../../api/mba";
import {ifExpire} from "../../api/login";
import {WF_NAMESPACE} from "../../config.js";
export default {
    components: {

    Group,
    XButton,
    Actionsheet,
    XTextarea,
    XNumber,
    Datetime,
    PopupPicker

    },
    data: function () {
      return {
        isSubmitDisabled:false,
        listPath:'/mba/leaveMyList',
        // vacationTypes:[{key:1,value:"事假"},{key:2,value:"病假"},{key:3,value:"年假"},{key:4,value:"婚假"},{key:5,value:"产假"},{key:6,value:"调休"},{key:7,value:"其他"}],
        vacationTypes:[{name:"事假",value:'1'},{value:'2',name:"年假"},{value:'3',name:"病假"},{value:'4',name:"婚假"},{value:'5',name:"产假"},{value:'6',name:"调休"},{value:'0',name:"其他"}],
        popMenuShow:false,
        popMenus:{menu1:"查看记录"},
        form:{
          leaveTypes:['1'],
          beginTime:'',
          endTime:'',
          days: 0.5,
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
         saveLeave(this.form).then(res=>{
           if(res.data.status == 1) {
             this.$vux.toast.text('保存成功', 'top')
             this.$router.replace({path: this.listPath});
           } else{

             this.$vux.toast.text('保存失败:'+res.data.msg, 'top')
           }


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




