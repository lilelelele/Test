<template>
  <div id="wfViewExamine_div">
    <x-header :left-options="{preventGoBack: true}" @on-click-back="backP('1')" slot="header" >{{$store.state.pageInf.title}}</x-header>
    <div class="content-wrap">
      <div class="flex-title">
        {{form.ownerName}}
      </div>
      <div class="f-divider"></div>
      <div class="flex-info">
        <div><span>所在部门</span><span>{{form.orgName}}</span></div>
        <div><span v-if="ifLeave()">请假类型</span><span v-if="ifLeave()">{{form.leaveTypeName}}</span></div>
        <div><span>开始时间</span><span>{{form.beginTime}}</span></div>
        <div><span>结束时间</span><span>{{form.endTime}}</span></div>
        <div><span>时长(天)</span><span>{{form.days}}</span></div>
        <div v-if="ifLeave()"><span >请假事由</span><span>{{form.memo}}</span></div>
        <div v-if="ifVisit()"><span >客户名称</span><span v-if="ifVisit()">{{form.targetName}}</span></div>
        <div v-if="ifVisit()"><span >拜访地址</span><span v-if="ifVisit()">{{form.address}}</span></div>
        <div v-if="ifVisit()"><span >事宜内容</span><span v-if="ifVisit()">{{form.memo}}</span></div>
        <div v-if="ifOverTime()"><span>加班事由</span><span v-if="ifOverTime()">{{form.memo}}</span></div>
        <div v-if="ifOverTime()"><span >加班地点</span><span v-if="ifOverTime()">{{form.address}}</span></div>
      </div>
      <div class="f-divider"></div>
      <template v-for="(item, index) in form.travels">
        <div class="flex-info">
          <div><span>订票人姓名</span><span>{{item.staffName}}</span></div>
          <div><span>订票人身份证</span><span>{{item.staffIdcard}}</span></div>
          <div><span>订票人手机号</span><span>{{item.staffTel}}</span></div>
          <div><span>始发地</span><span>{{item.origin}}</span></div>
          <div><span>目的地</span><span>{{item.destination}}</span></div>
          <div><span>去程信息</span><span>{{item.toInfo}}</span></div>
          <div><span>返程信息</span><span>{{item.returnInfo}}</span></div>
          <div><span>酒店名称</span><span>{{item.hotelName}}</span></div>
          <div><span>酒店地址</span><span>{{item.hotelAddress}}</span></div>
          <div><span>计划入住时间</span><span>{{item.hotelCheckin|formatDate}}</span></div>
          <div><span>申请人姓名</span><span>{{item.applicant}}</span></div>
          <div><span>承办人姓名</span><span>{{item.worker}}</span></div>
          <div><span>备注</span><span>{{item.memo}}</span></div>
        </div>
        <div class="f-divider"></div>
      </template>


      <div>
        <flow orientation="vertical" style="height:200px;">
          <template v-for="(item, index) in form.examines">
            <flow-line
                    v-bind:is-done="item.isDone == '1'"
            ></flow-line>
            <flow-state :state="index + 1"  v-bind:is-done="item.isDone == '1'">
              <div slot="title">

                <span v-if="ifNotCancelBySelf(item.userId,item.result)">{{item.wfdNodeName}}</span>
                <span>{{item.userName}}</span>
                <span>{{item.endTimeStr}}</span>
              </div>
            </flow-state>
          </template>
        </flow>
      </div>
    </div>
    <div><x-button   v-if="ifOwnerCancelBtn"   @click.native="cancelWf()" type="primary" >终止申请</x-button></div>
    <div  v-if="ifBottomButton" class="placeholder-bottom-div"></div>
    <div v-if="ifBottomButton" style="position: fixed;" class="flex-bottom-buttons  vux-1px-t">

      <div class="vux-1px-r" @click="openExamine(1)">同意</div>
      <div class="vux-1px-r" @click="openExamine(2)">驳回</div>
      <div class="vux-1px-r" @click="openExamine(3)">终止</div>
    </div>
    <div>
      <confirm v-model="ifExamineDialog"
               show-input
               ref="confirm5"
               :title="examineDialogTitle"
               :content="curOptionMemo"
               @on-confirm="afterExamine"
      >
      </confirm>
    </div>
    <loading :text="loadText" v-model="isLoading"></loading>
  </div>

</template>
<script>
  import {  Confirm,Divider,Flow, FlowState, FlowLine ,XInput, Card, Cell,CellBox,  Group, Selector, XButton, XTextarea, XNumber,Loading } from 'vux'
  import {findLeave,findVisit,findOvertime,examineWfNode} from "../../api/mba.js";
  import {WF_NAMESPACE,OA_EXAMINE_CONSTANT} from "../../config.js";
  export default {
    components: {
      Card,
      Cell,
      CellBox,
      Group,
      XInput,
      Selector,
      XButton,
      XTextarea,
      XNumber,
      Flow,
      FlowState,
      FlowLine,
      Divider,
      Confirm,
      Loading,

    },
    data: function () {
      return {
        bt:1,//页面开始时间
        loadText:"loading",
        isLoading:true,
        nsCode:'',
        viewMethodStr:'',
        msg: 'LOGO',
        lastUrl:'',
        oid: parseInt(this.$route.params.id),
        ifBottomButton:false,
        ifOwnerCancelBtn:false,


        ifExamineDialog:false,
        examineDialogTitle:"审批意见",
        curResult:1,
        curOptionMemo:"222222",

        form: {},
        examineForm:{
          result:1,
          opinion:"",
          bizId:parseInt(this.$route.params.id),
          bizType:"",
        },
      }
    },
    beforeRouteEnter(to,from,next){
      console.log("from.path",from.path);
      next(vm => {
        vm.lastUrl = from.path;
      })
    },

    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },

    mounted: function () {
      this.bt = new Date().getTime();
      this.viewMethodStr = this.$store.state.pageInf.sData.mainMethod;
      this.nsCode = this.$store.state.pageInf.sData.nsCode;
      this.initData();
    },

    methods: {
      findLeave: findLeave,
      findVisit: findVisit,
      findOvertime: findOvertime,
      initData: function () {
        this.find(this.oid);
      },
      find(id){
        console.log('yfffffflist1',this.viewMethodStr);
        this[this.viewMethodStr](id).then(res=>{
          this.form = res.data.element;
          this.ifOperable(this.form.state,this.form.operative,this.form.owner);

          let et = new Date().getTime();
          let dt = et - this.bt;
          console.log("be",dt)
          this.isLoading = false;
        });
      },
      ifOperable(wfState,operative,owner){
        if (operative == null || wfState != 1) return; //可操作人为空或者不是进行中状态
        let user = JSON.parse(localStorage.getItem("userJsonStr"));
        var arr = operative.split(",");
        if(arr.indexOf(user.id+"") != -1){//说明当前用户是可操作人
          this.ifBottomButton = true;
        }
        if(user.id == owner){
          this.ifOwnerCancelBtn = true;
        }

      },
      ifNotCancelBySelf(operator,option){
        if (operator == null ) return; //操作人为空不处理
        let user = JSON.parse(localStorage.getItem("userJsonStr"));
        if(operator == user.id && option==3){
          return false;
        }else{
          return true;
        }
      },

      openExamine(type){
        this.curResult = type;
        if(this.curResult === 1){
          this.examineDialogTitle = "通过意见";
        }else if(this.curResult === 2){
          this.examineDialogTitle = "驳回意见";
        }else if(this.curResult === 3){
          this.examineDialogTitle = "终止意见";
        }
        this.ifExamineDialog = true;
      },

      afterExamine(value){

        this.examineForm.result = this.curResult;
        this.examineForm.opinion = value;
        this.examineForm.nsCode = this.nsCode;
        examineWfNode(this.examineForm).then(res=>{
          this.$vux.toast.text('提交成功', 'top')
          this.backP();//刷新上一列表页
        });
      },
      cancelWf(){
        this.curResult = 3;
        this.examineDialogTitle = "终止意见";
        this.ifExamineDialog = true;
      },
      backP(flag){
        if(flag === "1") {
          localStorage.setItem("thisTimeListNoRefresh", "1");
        }
        this.$router.replace({path:this.lastUrl});
      },
      getCnName(nsCode){
        return OA_EXAMINE_CONSTANT[nsCode]['cnName'];
      },
      ifLeave(){
        if(this.nsCode == WF_NAMESPACE.LEAVE){
          return true;
        }
        return false;
      },
      ifVisit(){
        if(this.nsCode == WF_NAMESPACE.VISIT){
          return true;
        }
        return false;
      },
      ifOverTime(){
        if(this.nsCode == WF_NAMESPACE.OVERTIME){
          return true;
        }
      }

    }
  }
</script>

<style lang="scss">
  #wfViewExamine_div {
    .flex-title {
      margin-left: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
      height: 40px;

    }

    .flex-info {
      margin: 10px 0 10px 20px;

    }

    .flex-info div {
      display: flex;
      align-items: flex-start;
      height: auto;
    }

    .flex-info div span {
      display: inline-block;
    }

    .flex-info div span:nth-child(odd) {
      top: 0;
      color: #999999;
      width: 70px;
    }

    .flex-info div span:nth-child(even) {
      padding-left: 10px;
      max-width: 250px;

      word-wrap: break-word;
      word-break: break-all;
    }

    .weui-wepay-flow_vertical {
      margin-left: -300px;
    }

    .placeholder-bottom-div {
      height: 40px;
    }

    .flex-bottom-buttons {
      display: flex;
      width: 100%;
      bottom: 0;
      z-index: 500;
      background-color: #F7F7FA
    }
    .flex-bottom-buttons > div {
      flex: 1;
      text-align: center;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
    }
  }
</style>


