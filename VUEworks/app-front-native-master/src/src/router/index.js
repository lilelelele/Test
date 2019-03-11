import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/'
import {server, jsonp, axios} from '../config'
Vue.use(VueRouter)

const login = resolve => require(['../pages/login'], resolve);
const test = resolve => require(['../pages/test'], resolve);
const index = resolve => require(['../pages/index'], resolve);




const homeMain = resolve => require(['../pages/home/homeMain'], resolve);
const moduleList = resolve => require(['../pages/work/moduleList'], resolve);


const leaveAdd = resolve => require(['../pages/mba/leaveAdd'], resolve);
const visitAdd = resolve => require(['../pages/mba/visitAdd'], resolve);
const overtimeAdd = resolve => require(['../pages/mba/overtimeAdd'], resolve);


const wfDoList = resolve => require(['../pages/mba/wfDoList'], resolve);
const wfViewExamine = resolve => require(['../pages/mba/wfViewExamine'], resolve);



const dailyList = resolve => require(['../pages/work/dailyList'], resolve);
const dailyCheck = resolve => require(['../pages/work/dailyCheck'], resolve);
const dailyAdd = resolve => require(['../pages/work/dailyAdd'], resolve);
const dailyView = resolve => require(['../pages/work/dailyView'], resolve);




// 合同管理
const contractList = resolve => require(['../pages/contract/list'], resolve);
const contractDetail = resolve => require(['../pages/contract/detail'], resolve);





const myCenter = resolve => require(['../pages/my/myCenter'], resolve);
const myPhoto = resolve => require(['../pages/my/myPhoto'], resolve);
const mySet = resolve => require(['../pages/my/mySet'], resolve);
const myMsg = resolve => require(['../pages/my/myMsg'], resolve);
const myVideo = resolve => require(['../pages/my/myVideo'], resolve);





const router = new VueRouter({
  base: '/',
  routes:[

    { path: '', redirect: '/home/homeMain/1' },
    { path: '/', redirect: '/home/homeMain/1' },
    { path: '/login', component:login, meta: {title: '登陆'},
      beforeEnter: (to, from, next) => {
        next();
      },
    },
    { path: '/test', component:test, meta: {title: '额测试'},},
    {name:'test1', path: '/test1',params:{mode:'todo'}, query:{mode:'todo'}, component:test, meta: {title: '额测试'},},
    {name:'test2', path: '/test2',query:{mode:'done'}, component:test, meta: {title: '额测试'},},
    { path:'/index', component:index, meta: {title:'影谱合同系统'},
      beforeEnter: (to, from, next) => {
       next();
      },
      children: [
        {path:'/home/homeMain/:forceAutoLogin', component:homeMain, meta:{title:'首页'}},
        {path:'/work/moduleList', component:moduleList, meta:{title:'模块列表'}},
        {path:'/my/myCenter', component:myCenter, meta:{title:'个人中心'}},
        {path:'/my/myMsg', component:myMsg, meta:{title:'消息'}},

      ]
    },
    {path:'/work/dailyList', component:dailyList, meta:{title:'日报列表',keepAlive: false,}},
    { path: '/work/dailyCheck', component: dailyCheck, meta:{title:'日报审查',keepAlive: false,}},
    {path:'/work/dailyAdd', component:dailyAdd, meta:{title:'日报添加'}},
    {path:'/work/dailyView', component:dailyView, meta:{title:'日报查看'}},



    {path:'/mba/leaveAdd', component:leaveAdd, meta:{title:'添加请假'}},
    {path:'/mba/visitAdd', component:visitAdd, meta:{title:'添加外出'}},
    {path:'/mba/overtimeAdd', component:overtimeAdd, meta:{title:'添加加班'}},

    {path:'/mba/leaveViewExamine/:id', component:wfViewExamine, meta:{title:'请假详情页',sData:{mainMethod:'findLeave',nsCode:'com.moviebook.oa3_mba_leave'}}},
    {path:'/mba/visitViewExamine/:id', component:wfViewExamine, meta:{title:'外出详情页',sData:{mainMethod:'findVisit',nsCode:'com.moviebook.oa3_mba_visit'}}},
    {path:'/mba/overtimeViewExamine/:id', component:wfViewExamine, meta:{title:'加班详情页',sData:{mainMethod:'findOvertime',nsCode:'com.moviebook.oa3_mba_overtime'}}},



    {path:'/mba/todoList', component:wfDoList, meta:{title:'代办任务列表',sData:{mainMethod:'listTodoWf'},keepAlive: true,}},
    {path:'/mba/doneList', component:wfDoList, meta:{title:'已办任务列表',sData:{mainMethod:'listDoneWf'},keepAlive: true,}},
    {path:'/mba/leaveMyList', component:wfDoList, meta:{title:'我的请假列表',sData:{mainMethod:'listMyLeave'},keepAlive: true,}},
    {path:'/mba/visitMyList', component:wfDoList, meta:{title:'我的外出列表',sData:{mainMethod:'listMyVisit'},keepAlive: true,}},
    {path:'/mba/overtimeMyList', component:wfDoList, meta:{title:'我的加班列表',sData:{mainMethod:'listMyOvertime'},keepAlive: true,}},


    //合同管理
    { path: '/contract/list', component: contractList, meta: { title: '合同列表', keepAlive: true } },
    { path: '/contract/detail', component: contractDetail },


    {path:'/my/mySet', component:mySet, meta:{title:'设置'}},
    {path:'/my/myVideo', component:myVideo, meta:{title:'个人录像'}},
    { path: '/my/myPhoto', component: myPhoto, meta: { title: '个人头像' } },
  ]
})

// 路由全局钩子
router.beforeEach((to, from, next)=>{
  router.app.$store.commit('setPageInf',{title:to.meta.title,sData:to.meta.sData});
  next();

})



export default router;
