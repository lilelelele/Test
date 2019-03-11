import {stage} from '../static/stage';
import Axios from 'axios';
import {getClass} from './util';
import {backLogin} from './api/login';


const env = {
	local: {//本机环境
		server: 'http://172.16.0.49:7007',
		//server: 'http://localhost:7007',
	},
	prod: {//正式环境
		server: 'http://api.oa3.moviebook.cn',
	},
	dev: {//开发环境
		server: 'http://dev.api.oa3.moviebook.cn',
	},
	test: {//测试环境
		server: 'http://test.api.oa3.moviebook.cn',
	}
};

export const CAS_ST_SERVER_URL_PATH = '/sys/getSt';
export const CAS_PC_CAS_PRE = '/bLogin';
export const OA_SESSION_ID_KEY = 'com-moviebook-oa-authtoken';

/*
 *
 */
/**  本项目使用的常量      **/

/**  本项目使用的常量      **/
export const WF_NAMESPACE = {
  LEAVE:'com.moviebook.oa3_mba_leave', //请假的命名空间
  VISIT:'com.moviebook.oa3_mba_visit', //外出的命名空间
  OVERTIME:'com.moviebook.oa3_mba_overtime'
}

export const OA_EXAMINE_CONSTANT = {
  'com.moviebook.oa3_mba_leave':{detailUrl:'/mba/leaveViewExamine',cnName:'请假'}, //请假的命名空间
  'com.moviebook.oa3_mba_visit':{detailUrl:'/mba/visitViewExamine',cnName:'外出'}, //外出的命名空间
  'com.moviebook.oa3_mba_overtime':{detailUrl:'/mba/overtimeViewExamine',cnName:'加班'},//加班的命名空间

}
/**  end-本项目使用的常量  **/






console.log('%c'+stage,'color: green;font-size:20px;');

Axios.defaults.baseURL = env[stage].server;
Axios.defaults.withCredentials = true;
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.defaults.headers.authToken = '1111-1111-1111-1111';//初始化占位符

//添加一个拦截器
Axios.interceptors.response.use(function (response) {
	return response;
}, function(err){
	let msg;

	if(!err.response){
		msg = '请求错误，请检查后台服务是否可用！';
    window.vm.$router.push({path: '/login'});
	} else if (err && err.response) {
		let status = parseInt(err.response.status);
		switch (status) {
			case 400: msg = '请求错误，请检查您的网络是否可用！';break;
			case 401: msg = '请先登陆！';break;
			case 402: msg = '登陆过期，请重新登陆！'; break;
			case 403: msg = '拒绝访问！';break;
			case 404: msg = '请求地址错误：' + err.response.config.url;break;
			case 408: msg = '请求超时，请重试！';break;
      case 409:
      	if(err.response.data.msg){
          msg = err.response.data.msg;
				}else{
          msg = '程序内部错误';
				}
      	break;

			case 500: msg = '服务器内部错误！';break;
			case 501: msg = '服务未实现！';break;
			case 502: msg = '网关错误！';break;
			case 503: msg = '服务不可用！';break;
			case 504: msg = '网关超时！';break;
			case 505: msg = 'HTTP版本不受支持！';break;
			default: msg = '未知错误！';break;
		};

		// 如果处于这两种状态，则跳转到登陆页
		console.log([401, 402].indexOf(status));
		[401, 402].indexOf(status) >= 0 ? backLogin(2) : !1;
		//[401, 402].indexOf(status) >= 0 ? window.vm.$router.push({path: '/home/homeMain/1'}) : !1;
		//[401, 402].indexOf(status) >= 0 ? window.vm.$router.push({path: '/login'}) : !1;
		//[401, 402].indexOf(status) >= 0 ? window.vm.$router.push({path: '/home/homeMain?forceAutoLogin=1'}) : !1;
		//[401, 402].indexOf(status) >= 0 ? window.vm.$vux.toast.text('401 402错误', 'top') : !1;
		//[409].indexOf(status) >= 0 ? window.vm.$router.push({path: '/home/homeMain?forceAutoLogin=1'}) : !1;
		[409].indexOf(status) >= 0 ? window.vm.$router.push({path: '/login'}) : !1;
	};

	// 并行请求错误时，解决拦截器多次提示
	//getClass('interceptor').length < 1 ? window.vm.$notify.error({ title: '提示', message: msg, customClass: 'authInvalid interceptor' }) : !1;
	getClass('interceptor').length < 1 ? window.vm.$vux.toast.text(msg, 'top')  : !1;

	return Promise.reject(err);
});

export const server = env[stage].server;

export const CAS_ST_SERVER_URL = env[stage].server + CAS_ST_SERVER_URL_PATH;



export const axios = Axios;