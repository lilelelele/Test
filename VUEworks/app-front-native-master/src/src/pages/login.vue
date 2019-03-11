<template>
  <div id="loginBg" class="login-page">
		<div class="login-form">
			<div class="form-tips">
				<div class="tips-logo" />
				<div class="tips-hello">
					<span>Hello!</span>
					<span>MovieBooker</span>
				</div>
				<div class="tips-welcome">欢迎回来</div>
			</div>

			<div class="form-list">
				<group title="邮箱" class="list-group">
					<x-input v-model.trim="form.username" :show-clear="false" :max="20" placeholder="请输入用户名">
						<div class="username_slot_right" slot="right">{{suffix}}</div>
					</x-input>
				</group>

				<group title="密码" class="list-group">
					<x-input v-model.trim="form.password" :show-clear="false" :max="20" type="password" placeholder="请输入密码" />
				</group>

				<group class="list-group">
					<x-button :class="{success: (form.username && form.password)}" @click.native="handleSubmit">登 录</x-button>
				</group>
			</div>
		</div>
		<loading v-if="requestState" :show="true" text="Loading..." />
	</div>
</template>
<script>
  import{login, caslogin, getSt} from "../api/login";
  import {server, axios, CAS_PC_CAS_PRE, OA_SESSION_ID_KEY} from '../config'
  import { XInput, Group, XButton } from 'vux'


  import { Alert,ToastPlugin,Loading } from 'vux'

  export default {
    name: 'login',
    components: { XInput, XButton, Group, Loading },
    data () {
		return {
			requestState: false,
			suffix: '@moviebook.cn',
			form: {
				username: '',
				password: '',
				service: server + CAS_PC_CAS_PRE
			},
		}
	},

    methods: {
		handleSubmit () {
			//清楚缓存
			localStorage.removeItem('jsessionid')
			localStorage.removeItem('lastAutoHomeLoginTime')
			localStorage.removeItem('userJsonStr')
			localStorage.removeItem('userFormJsonStr')

			console.log("login.vue-->开始提交");

			let { username, password, service } = this.form;

			if(!username){
				this.$vux.toast.text('请输入用户名~', 'top');
			} else if (!password){
				this.$vux.toast.text('请输入密码~', 'top');
			} else {
				let param = {
					username: username + this.suffix,
					password: password,
					service: service
				};
				this.requestState = true;
				getSt(param).then(res=>{
					if(1 === res.data.status){//说明拿到st
						console.log("拿到st",res.data.element);
						caslogin(res.data.element).then(r=>{
							if(1 === r.data.status){
								console.log("通过st登录成功",res.data.element);
								localStorage.setItem("jsessionid", r.data.element.jsessionid)//放jsessionid到本地缓存
								localStorage.setItem('lastAutoHomeLoginTime',String(new Date().getTime()))//刷新最后一次登录时间
								localStorage.setItem('userJsonStr',JSON.stringify(r.data.element)); //把用户对象转化为json字符串放进缓存
								localStorage.setItem('userFormJsonStr',JSON.stringify(param))///把用户表单转化为json字符串放进缓存


               // this.$store.commit('setAuthList',r.data.element.permissionList);

								axios.defaults.headers[OA_SESSION_ID_KEY] = r.data.element.jsessionid;
								// 给Jpush设置别名
								this.$jpush.setAlias(r.data.element.id, r.data.element.username);

								this.$vux.toast.text('登录成功，跳转中', 'top');
								this.$router.push({path: '/home/homeMain/0'});
							}else {
								this.$vux.toast.text('登录失败:'+ res.data.msg, 'top');
							}

						});
					}else{
						this.$vux.toast.text('登录失败:'+ res.data.msg, 'top');
					};
					this.requestState = false;
				}).catch( error => {
					this.requestState = false;
				});
			};
		},
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
	.login-page{
		width: 100%;
		height: 100%;
		padding-bottom: 70px;
		box-sizing: border-box;
		background: 
			url('../assets/moviebook.png') no-repeat scroll center calc(100% - 35px) / 25%,
			url('../assets/oa-bg.png') no-repeat scroll center / 100%;
		overflow: hidden;

		.login-form{
			height: 100%;
			padding: 40px 40px 0;
			box-sizing: border-box;
			overflow: auto;

			.form-tips{

				.tips-logo{
					width: 60px;
					height: 60px;
					border-radius:50px;
				}

				.tips-hello{
					width: 100%;
					height: 40px;
					line-height: 40px;
					display: inline-block;
					color: #fff;
					margin-top: 20px;
					overflow: hidden;

					span:nth-child(1){
						font-size: 2.5rem;
						margin-right: 5px;
					}

					span:nth-child(2){
						font-size: 1.3rem;
					}
				}

				.tips-welcome{
					color: #fff;
					font-size: 2rem;
					margin-bottom: 40px;
				}
			}

			.form-list{

				.list-group{
					margin-bottom: 3rem;

					&:last-child{
						margin-top: 5rem;
						margin-bottom: 0;
					}

					.weui-cells__title{
						padding: 0;
						margin-bottom: 0;
					}

					.weui-cells{
						background: rgba(0, 0, 0, 0);

						&::before, &::after{
							display: none;
						}

						.vux-x-input{
							padding: 0;

							input{
								font-size: small;
								color: #ccc;
								padding: 5px 0;
								border-bottom: 1px solid #999;
								border-radius: 0;

								&:focus{
									border-bottom: 1px solid #ccc;
								}
							}
						}

						button{
							background-color: rgba(238,238,238,0.2);
							border: none;
							color: #999;

							&.success{
								background-color: #007AFF;
								color: #fff;
							}
						}
					}
				}
			}
		}
	}
</style>
