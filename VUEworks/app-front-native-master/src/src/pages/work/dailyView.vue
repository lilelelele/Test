<template>
	<div class="daily-detail">
		<x-header :right-options="{showMore: $store.state.isCensor}" @on-click-more="showMenus = true">日报详情</x-header>
		
		<div class="datetime-box">
			<x-input v-model="form.dayDate" disabled readonly="readonly" placeholder="选择日期" />
		</div>

		<div class="content-wrap">
			<div v-for="(item, index) in form.detailList" :key="index" class="cardSytle" slot="content">
				<group>
					<x-input readonly class="required-field" title="项目" v-model="item.mbProjectName" placeholder-align="right" text-align="right" />
					<x-input readonly class="required-field" title="版本" v-model="item.mbProjectVersionName" placeholder-align="right" text-align="right" />
					<x-input readonly class="required-field" title="工作时长" v-model="item.hours" placeholder-align="right" text-align="right" />
					<x-input readonly title="遇到问题" placeholder="未填写" v-model="item.question" placeholder-align="right" text-align="right" />
					<x-input readonly title="解决方法" placeholder="未填写" v-model="item.solve" placeholder-align="right" text-align="right" />
					<x-textarea readonly class="required-field" title="工作内容" autosize v-model="item.memo" />
				</group>
			</div>

			<group>
				<x-textarea readonly class="required-field" title="明日计划" autosize v-model="form.plan" />
			</group>
		</div>
		
		<div v-transfer-dom>
			<actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="menuClick"></actionsheet>
		</div>

		<loading v-if="loading" :show="true" text="请稍后..." />
	</div>
</template>

<script>
  	import { Actionsheet, TransferDom, XInput, Group, XButton, XTextarea, Loading } from 'vux'
  	import{ findDaily, getUsableProjects, delDaily} from "../../api/work";
  	export default {
		directives: { TransferDom },
		components: { Actionsheet, XInput, Group, XButton, XTextarea, Loading },
    	data (){
			return{
				loading: true,

				// 日报id
				id: parseInt(this.$route.query.id),
				
				// 是否显示菜单
				showMenus: false,
				
				// 菜单
				menus: {
					mod: '修改',
					del: '删除',
				},
				
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
			this.getDaily();
		},

		methods: {
			// 菜单被点击
			menuClick (action, item){
				switch (action) {
					case 'mod': this.modDaily(); break;
					case 'del': this.delDaily(); break;
					default: break;
				};
			},

			// 修改
			modDaily (){
				this.$router.push('/work/dailyAdd?id=' + this.id);
			},

			// 删除
			delDaily (){
				let that = this;
				this.$vux.confirm.show({
					title: '提示',
					content: '删除后将不可恢复，确定吗？',
					onConfirm () {
						delDaily(that.id).then(res => {
							console.log(res);
							if(1 === res.data.status){
								that.$vux.toast.text(res.data.msg, 'top');
								that.$router.push({ path: '/work/dailyList' });
							} else {
								that.$vux.toast(res.data.msg, 'top');
							};
						});
					}
				});
			},

			// 获取日报
			getDaily (){
				findDaily(this.id).then(res => {
					if(1 === res.data.status){
						this.form = res.data.element;
					} else {
						this.$router.push({ path: '/work/dailyList' });
					};
					this.loading = false;
				});
			},
		}
  	}
</script>

<style lang="scss">
	.daily-detail{
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

				.weui-input{
					background: #fff;
					text-align: center;
					border-radius: 5px;
				}
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

			.weui-textarea{
				background: #fff;
				overflow-y: auto !important;
			}
		}
	}
</style>


