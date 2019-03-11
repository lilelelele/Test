<template>
  <div id="wfDoList_div" style=" height:100%;">
    <x-header  class="x-header-fix">{{$store.state.pageInf.title}}</x-header>
    <div class="scrollerWrap">
      <div style="height: 1px;"></div>
    <scroller  class="scroller_class" height="100%"  :on-refresh ="refresh" :noDataText="noDataText" :on-infinite="loadMore" ref="my_scroller">
      <group>
        <cell primary="content" align-items="flex-start"  v-for=" item in datas" :key="item.id+item.nsCode" :link="{path:getDetailPath(item.nsCode)+'/'+item.id,replace: true}"  >
          <div class="box">
            <div ><img class="face-img" src="../../assets/face.jpg"/></div>
            <div>
              <div class="title">{{item.ownerName}}的{{getCnName(item.nsCode)}}</div>

              <div v-if="ifLeave(item.nsCode)">请假类型:{{item.leaveTypeName}}</div>

              <div>开始时间: {{item.beginTime}}</div>
              <div>结束时间: {{item.endTime}}</div>


              <div v-if="ifVisit(item.nsCode)">客户名称: {{item.targetName}}</div>
              <div v-if="ifVisit(item.nsCode)">拜访地址: {{item.address}}</div>

              <div>状态: {{item.wfStep}}</div>
            </div>
            <div>{{item.createTime}}</div>
          </div>
        </cell>
      </group>
    </scroller>
    </div>
  </div>
</template>
<script>

  import{_fspBean,listMyLeave,listMyVisit,listMyOvertime,listTodoWf,listDoneWf} from "../../api/mba";
  import{OA_EXAMINE_CONSTANT,WF_NAMESPACE}  from "../../config";
  import { Group,Cell } from 'vux'

  export default {
    components: {
      Group,
      Cell,

    },
    data:function(){
      return{
        listMethodStr:'',//当前方法
        fsp:_fspBean,
        datas:[],
        dayTitle:"2018-08-12",
        dayMsg:"我是一个好好好的工作的一天",
        loadingTips:"",
        isBottom:false,
        noDataText:"--我也是有底线的--",
      }
    },

    beforeRouteEnter(to,from,next){
       console.log("beforeRouteEnter");

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
    },
    activated(){

      if(localStorage.getItem("thisTimeListNoRefresh") == "1"){
        localStorage.removeItem("thisTimeListNoRefresh")
      }else{
        let curListMethodUrl = this.$store.state.pageInf.sData.mainMethod;
        this.listMethodStr = curListMethodUrl;
        console.log("activated start!!!!!!",this.listMethodStr);
        this.initData();
      }



    },
    mounted: function() {
      let curListMethodUrl = this.$store.state.pageInf.sData.mainMethod;
      this.listMethodStr = curListMethodUrl;
      console.log("mounted start!!!!!!",this.listMethodStr);
      this.initData();
      //this.initData();
    },

    methods: {
      listMyLeave: listMyLeave,
      listMyVisit: listMyVisit,
      listMyOvertime: listMyOvertime,
      listTodoWf: listTodoWf,
      listDoneWf: listDoneWf,
      initData(){
        this.refresh();
      },
      list(foo) {
        this[this.listMethodStr](this.fsp).then(res=>{
          console.log('res',res)
          if(res.data.fsp.pageNo == 1){
            this.datas = res.data.datas;
          }else{
            this.datas = this.datas.concat(res.data.datas);
          }
          this.fsp = res.data.fsp;

          foo&&foo();
        });
      },
      refresh(){
        console.log("我刷新了呀");
        this.datas=[];
        this.fsp.pageNo = 1;
        this.$refs.my_scroller.finishInfinite(false);
        setTimeout(()=>{
            this.list();
        }, 500)
        this.timeout = setTimeout(()=>{
            this.$refs.my_scroller.finishPullToRefresh()
        }, 1000)

      },
      loadMore(done){//上拉加载
          setTimeout(()=>{
              if(this.fsp.pageNo < this.fsp.pageCount || this.fsp.pageCount == 0 ){
                  this.fsp.pageNo ++ ;
                  this.list(this.loadMoreAfter(done));
              }else{
                  console.log("done1");
                  this.loadMoreAfter(done);
              }
           }, 1000)
        },
      loadMoreAfter(done){
          if(this.fsp.pageNo >= this.fsp.pageCount){
             done();
             this.$refs.my_scroller.finishInfinite(true);
         }else{
             done();
         }
      },
      getDetailPath(nsCode){
        return OA_EXAMINE_CONSTANT[nsCode]['detailUrl'];
      },
      getCnName(nsCode){
        return OA_EXAMINE_CONSTANT[nsCode]['cnName'];
      },
      ifLeave(nsCode){
        if(nsCode == WF_NAMESPACE.LEAVE){
          return true;
        }
        return false;
      },
      ifVisit(nsCode){
        if(nsCode == WF_NAMESPACE.VISIT){
          return true;
        }
        return false;
      },
      ifOverTime(nsCode){
        if(nsCode == WF_NAMESPACE.OVERTIME){
          return true;
        }
        return false;
      }

    }
  }
</script>

<style lang="scss">

  #wfDoList_div {
    .scrollerWrap {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 40px;
      bottom: 20px;
    }

    .face-img {
      width: 60px;
      height: 60px;
    }

    .box {
      display: flex;
    }

    .box div {
      text-align: left;
    }

    .box > div:nth-child(1) {
      padding-right: 2px;
      text-align: left;
    }

    .box > div:nth-child(2) {
      margin-left: 5px;
      overflow: hidden;
      max-width: 190px;
      flex-grow: 1;

    }

    .box > div:nth-child(3) {
      overflow: hidden;

    }

    .box .title {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
    }
  }

</style>


