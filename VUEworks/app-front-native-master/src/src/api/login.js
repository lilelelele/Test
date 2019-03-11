import {server, axios, jsonp,CAS_ST_SERVER_URL,OA_SESSION_ID_KEY} from '../config'
import {IEVersion} from '../util'
import {fspBean} from "./model";
import Axios from "axios/index";


const ie = IEVersion();
const host = window.location.host;
const url = ie == 'IE9' ? host + '/#/index' : host + '/index';

//登录
export function login(param){
    return axios.post('/sys/login', param);
};

//cas登录
export function caslogin(st){
  return axios.post('/appLogin?ticket='+st);
};
//获取St
export function getSt(param){
  return axios.post(CAS_ST_SERVER_URL, param,{timeout: 1000 * 20 * 1});
};




//获取当前用户信息
export function getLoginName(){
  return axios.post('/sys/getLoginName');
};



//单系统退出登录
export function logout(){//退出登录
    console.log('logout');
    return axios.post('/sys/logout');
};

//做登录超时联通性测试
export function ifExpire(){
  return axios.post('/sys/ifExpire');
};
//判断是否已经登录
export function ifLogin(){
  let userJsonStr = localStorage.getItem("userJsonStr");
  if(!userJsonStr){
    console.log("ifLogin跳转");
    window.vm.$router.push({path: '/login'})
    return;
  }
};


//通过缓存的用户对象后台自动登录
export function backLogin(type){

  console.log("backLogin type",type);
  let userFormJsonStr = localStorage.getItem('userFormJsonStr')
  if(userFormJsonStr && userFormJsonStr != 'undefined'){
    let userForm = JSON.parse(userFormJsonStr);
    getSt(userForm).then(res=>{
      if(res.data.status ==1){//说明拿到st
        console.log("拿到st",res.data.element);
        caslogin(res.data.element).then(r=>{
          if(r.data.status == 1){
            console.log("通过st登录成功",res.data.element);
            localStorage.setItem("jsessionid", r.data.element.jsessionid)//放jsessionid到本地缓存
            localStorage.setItem('userJsonStr',JSON.stringify(r.data.element)); //把用户对象转化为json字符串放进缓存
            localStorage.setItem('lastAutoHomeLoginTime',String(new Date().getTime()))//刷新最后一次登录时间
            axios.defaults.headers[OA_SESSION_ID_KEY] = r.data.element.jsessionid;
            axios.defaults.headers.authToken = r.data.element.jsessionid;//初始化占位符
            window.vm.$vux.toast.text('自动登录成功'+r.data.element.jsessionid, 'top');
            console.log('自动登录成功'+r.data.element.jsessionid);

            //window.vm.$store.commit('setAuthList',r.data.element.permissionList);
          }else {
            window.vm.$vux.toast.text('自动登录失败', 'top')
            window.vm.$router.replace({path: '/login'});
          }

        });
      }else{
        window.vm.$vux.toast.text('登录失败:'+ res.data.msg, 'top');
        window.vm.$router.replace({path: '/login'});
      }
    })

  } else{//一般情况下需要自动登陆，肯定是有最后一次登陆时间，就肯定会存用户的密码信息，这个只是未知情况
    console.error("没有找到存储的用户对象,跳转至登陆页")
    window.vm.$router.replace({path: '/login'});
  }
};


//判断并且自动登录
export function checkAndAutoLogin(forceAutoLogin){
  console.log('checkAndAutoLogin method  :: forceAutoLogin :',forceAutoLogin);
  let ifUseAutoLogin = false //需要自动登陆标示
  if(forceAutoLogin!=1){
    let lastTime = Number(localStorage.getItem('lastAutoHomeLoginTime'))
    let cutTime = new Date().getTime()
    if (lastTime) {//有最后一次登陆时间，说明已经登陆过，需要自动登陆。没有登陆最后一次登陆时间说明不需要自动登陆
      if ((cutTime - lastTime) > 24 * 3600 * 1000) {
        ifUseAutoLogin = true
      }
    }
  }else{
    ifUseAutoLogin = true;
  }
  //需要自动登陆，如果自动登陆不成功就跳转到登陆页面
  if (ifUseAutoLogin) {
    backLogin(1);
  }

  if(ifUseAutoLogin){
    console.log("我自动登陆呀")
  }else{
    console.log("没有自动登陆")
  }
};
