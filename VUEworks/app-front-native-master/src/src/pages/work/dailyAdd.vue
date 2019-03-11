<template>
	<div class="daily-add">
		<x-header>
			<span v-if="!isEdit">添加日报</span>
			<span v-if="isEdit">修改日报</span>
			<a slot="right" @click="save">保存</a>
		</x-header>

		<div class="datetime-box">
			<x-input v-model="form.dayDate" @on-focus="showDataTime" readonly="readonly" placeholder="选择日期" />
			<x-button @click.native="addDetail">新增明细</x-button>
		</div>

		<div class="content-wrap">
			<swipeout>
				<swipeout-item v-for="(item, index) in form.detailList" :key="index" :disabled="1 === form.detailList.length">
					<div class="cardSytle" slot="content">
						<group>
							<selector class="required-field" :options="projectList" v-model="item.mbProject" direction="rtl" placeholder="请选择项目" title="项目" />
							<selector class="required-field" :options="versionOption(item.mbProject)" :value-map="['versionId', 'versionNum']" v-model="item.mbProjectVersion" direction="rtl" placeholder="请选择版本" title="版本" :disabled="item.mbProject" />
							<x-number class="time-number required-field" title="工作时长" :min="0" :max="20" v-model="item.hours" />
							<x-input title="遇到问题" v-model="item.question" placeholder="请输入遇到问题" placeholder-align="right" text-align="right" />
							<x-input title="解决方法" v-model="item.solve" placeholder="请输入解决方法" placeholder-align="right" text-align="right" />
							<x-textarea class="required-field" title="工作内容" :rows="4" v-model="item.memo" />
						</group>
					</div>

					<div slot="right-menu">
						<swipeout-button @click.native="delProject(index)" type="warn">删除</swipeout-button>
					</div>
				</swipeout-item>
			</swipeout>

			<group>
				<x-textarea class="required-field" title="明日计划" autosize v-model="form.plan" />
			</group>
		</div>

		<loading v-if="loading" :show="true" text="请稍后..." />
	</div>
</template>

<script>
import { XInput, Group, Selector, XButton, XTextarea, XNumber, Swipeout, SwipeoutItem, SwipeoutButton, Loading } from 'vux'
import { getUsableProjects, saveDaily, findDaily} from "../../api/work";
export default {
  	components: { Group, XInput, Selector, XButton, XTextarea, XNumber, Swipeout, SwipeoutItem, SwipeoutButton, Loading },
  	data: function () {
		return {

			loading: false,

			// 日报id
			id: Number(this.$route.query.id),

			// 是否是编辑模式
			isEdit: false,
		
			// 待选项目列表
			projectList: [],

			// 待选版本列表
			versionList: {},

			// 日报表单
			form: {
				dayDate: '',//日期
				detailList: [{
					mbProject: '',//项目
					mbProjectVersion: '',//版本
					hours: 0,//时长
					question: '',//遇到问题
					solve: '',//解决方法
					memo: '',//工作内容
				}],
				plan:'',//明日计划
			},
		}
	},

	created (){
		this._getUsableProjects();

		// 通过判断是否传递id来决定是添加、编辑模式
		if(this.id){
			this.isEdit = true;
			this.getDaily();
		};
	},

	computed:{
		versionOption (id){
			let that = this;
			return function(id){
				return id ? that.versionList[id] : [];
			}
		}
	},
	
  	methods: {
	
		// 获取项目列表
		_getUsableProjects () {
			getUsableProjects().then( res => {
				let datas = res.data.datas;
				for (let i = 0; i < datas.length; i++) {
					let id = datas[i].projectId;
					this.projectList.push({
						key: id,
						value: datas[i].name
					});
					this.versionList[id] = datas[i].versions;
				}
				console.log(this.versionList);
			});
		},

		// 获取日报
		getDaily (){
			findDaily(this.id).then(res => {
				if(1 === res.data.status){
					let [form, els, list] = [this.form, res.data.element, []];
					form.id = els.id;
					form.dayDate = els.dayDate;
					form.plan = els.plan;

					for(let i = 0; i < els.detailList.length; i++){
						let item = els.detailList[i];
						list.push({
							mbProject: item.mbProject,//项目
							mbProjectVersion: item.mbProjectVersion,//版本
							hours: item.hours,//时长
							question: item.question,//遇到问题
							solve: item.solve,//解决方法
							memo: item.memo,//工作内容
						});
					};

					form.detailList = list;
				} else {
					this.$vue.toast.text(res.data.msg, 'top');
				};
			});
		},
	
		// 删除一个明细
		delProject (index) {
			this.form.detailList.splice(index, 1);
		},

		// 显示日期选择器
		showDataTime () {
			let that = this;
			this.$vux.datetime.show({
				cancelText: '取消',
				confirmText: '确定',
				format: 'YYYY-MM-DD',
				value: this.form.dayDate,
				onHide (){
					that.form.dayDate = this.value;
				}
			});
		},
	
		// 新增明细
		addDetail () {
			this.form.detailList.push({
				mbProject: '',//项目
				mbProjectVersion: '',//版本
				hours: 0,//时长
				question: '',//遇到问题
				solve: '',//解决方法
				memo: '',//工作内容
			});
		},
	
	// 保存日报
    save() {

		// 判断是否选择了日期
		if(!this.form.dayDate){
			this.$vux.toast.text('请选择日期~', 'top');
			return false;
		};

		// 循环验证必填字段
		let state = true;
		for(let i = 0; i < this.form.detailList.length; i++){
			let item = this.form.detailList[i];
			if(!item.mbProject){
				this.$vux.toast.text('请选择项目~', 'top');
				state = false;
				continue;
			};

			if(!item.mbProjectVersion){
				this.$vux.toast.text('请选择版本~', 'top');
				state = false;
				continue;
			};

			if(!item.hours){
				this.$vux.toast.text('请输入工作时长~', 'top');
				state = false;
				continue;
			};

			if(!item.memo){
				this.$vux.toast.text('请输入工作内容~', 'top');
				state = false;
				continue;
			};
		};

		if(!this.form.plan){
			this.$vux.toast.text('请输入明日计划~', 'top');
			return false;
		};

    	if(state){
			this.loading = true;
			saveDaily(this.form).then(res => {
				if (res.data && res.data.status == 1) {
					this.$vux.toast.text(res.data.msg, 'top');
					this.$router.push({ path: '/work/dailyList' });
				} else {
					this.$vux.toast.text(res.data.msg, 'top');
				};
				this.loading = false;
			});
      	};
    },
 }
}
</script>

<style lang="scss">
.daily-add{
	width: 100vw;
	height: 100vh;
	background: #F5F5F5;

	.vux-header{
		position: fixed;
		width: 100vw;
	}

	.datetime-box{
		width: 100vw;
		height: 50px;
		position: fixed;
		left: 0;
		top: 46px;

		.vux-x-input{
			width: 60vw;

			.weui-input{
				background: #fff;
				text-align: center;
				border-radius: 5px;
			}
		}

		.weui-btn{
			position: absolute;
			top: 10px;
			right: 10px;
			width: 29vw;
			box-sizing: border-box;
			font-size: 14px;
			padding: 0;
		}
	}

	.content-wrap{
		width: 100vw;
		height: calc(100vh - 96px);
		position: fixed;
		top: 0;
		left: 0;
		margin-top: 96px;
		overflow: auto;

		.weui-cells{
			margin-top: 0;
		}
		
		.cardSytle {
			width: 100vw;
			margin-bottom: 10px;
			background: #fff;

			.time-number{
				padding: 0 10px 0 15px;
				line-height: normal;
			}
		}

		.required-field{
			padding-left: 6px !important;

			label, p{
				&::before{
					content: '* ';
					color: red;
					vertical-align: sub;
				}
			}
		}
	}
}
</style>


