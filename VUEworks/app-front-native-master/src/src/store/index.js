import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//暂无内容，需要再加
const store = new Vuex.Store({
	state: {
		user: {},
		pageInf: {title:"主页",sData:{}},
    authList:[],
		action: false,//分析页面侧边栏显示状态
		contractNavShow: [],//合同管理模块，每个页面根据此参数显示菜单不同
		isShowFlow: false,//合同审批页面，是否显示流程弹窗
		isCensor: false,//是否是日报审查模式
	},
	actions: {

	},
	mutations: {/// 同步更新数据
		setUser(state,user){
			state.user = user;
		},
		setAction(state, action){
			state.action = action;
		},
    setAuthList(state,authList){
       state.authList = authList;
    },


		setPageInf(state,pageInf){
				state.pageInf = pageInf;
		},
		getPageInf(state){
				return state.pageInf;
		},
		setNavShow(state, value){
			return state.contractNavShow = value;
		},



		setShowFlow(state){
			state.isShowFlow = !state.isShowFlow;
		},

		setCensor(state, value){
			state.isCensor = value;
		}

	}
});

export default store;