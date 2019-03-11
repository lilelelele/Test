<template>
	<div id="daily-list">
		<x-header :left-options="{preventGoBack: true}" @on-click-back="headerReturn">
			{{$route.meta.title}}
			<x-icon slot="right" type="ios-plus-empty" size="30" @click="add" />
		</x-header>

		<div class="scrollerWrap">
			<scroller class="scroller_class" height="100%" :on-refresh ="refresh" :on-infinite="loadMore" ref="my_scroller">
				
				<group class="list_group">
					<swipeout>
						<swipeout-item transition-mode="follow" v-for=" item in datas" :key="item.id">
							<cell slot="content" primary="content" :link="{path:'/work/dailyView',query:{id:item.id}}">
								<div class="box">
									<div>{{item.dayDate}}</div>
									<div>{{item.memo}}</div>
								</div>
							</cell>

							<div slot="right-menu">
								<swipeout-button type="primary" @click.native="modClick(item)">修改</swipeout-button>
								<swipeout-button type="warn" @click.native="delClick(item)">删除</swipeout-button>
							</div>
						</swipeout-item>
					</swipeout>
				</group>
				
			</scroller>
		</div>
	</div>
</template>
<script>

	import { _fspBean, listDaily, delDaily, userList } from "../../api/work";
	import { Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

  	export default {
		components: { Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton },
	
		data: function(){
			return{
				fsp: _fspBean,
				datas: [],
			}
		},

		// 路由进入
		beforeRouteEnter(to, from, next){

			// 日报详情使用的是同一个页面，所以需要区分状态是否可操作
			vm.$store.commit('setCensor', true);

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

		// 路由离开
		beforeRouteLeave(to,from,next){//记录离开时的位置
			console.log("beforeRouteLeave")
			sessionStorage.askPositon = this.$refs.my_scroller && this.$refs.my_scroller.getPosition() && this.$refs.my_scroller.getPosition().top;
			console.log("sessionStorage.askPositon1",sessionStorage.askPositon)
			next()
		},

		mounted (){
			this.refresh();
		},
	
		methods: {

			// 自定义返回
			headerReturn (){
				this.$router.push('/work/moduleList');
			},

			// 修改日报
			modClick (item){
				this.$router.push('/work/dailyAdd?id=' + item.id);
			},

			// 删除日报
			delClick (item){
				let that = this;
				this.$vux.confirm.show({
					title: '提示',
					content: '删除后将不可恢复，确定吗？',
					onConfirm () {
						delDaily(item.id).then(res => {
							console.log(res);
							if(1 === res.data.status){
								that.$vux.toast.text(res.data.msg, 'top');
								that.refresh();
							} else {
								that.$vux.toast(res.data.msg, 'top');
							};
						});
					}
				});
			},

			// 获取当前登录用户的日报列表
			getListDaily(foo) {
				listDaily(this.fsp).then(res=>{
					if(res.data.fsp.pageNo == 1){
						this.datas = res.data.datas;
					}else{
						this.datas = this.datas.concat(res.data.datas);
					}
					this.fsp = res.data.fsp;
					console.log("done2");
					foo&&foo();
				});
			},

			// 跳转到添加日报页面
			add(){
				this.$router.push("/work/dailyAdd");
			},
			
			// 刷新
			refresh(){
				console.log("我刷新了呀");
				this.datas=[];
				this.fsp.pageNo = 1;
				this.$refs.my_scroller.finishInfinite(false);
				setTimeout(()=>{
					this.getListDaily();
				}, 1000)
				this.timeout = setTimeout(()=>{
					this.$refs.my_scroller.finishPullToRefresh()
				}, 1500);
			},

			// 上拉加载
			loadMore(done){
				setTimeout(()=>{
					if(this.fsp.pageNo < this.fsp.pageCount || this.fsp.pageCount == 0 ){
						this.fsp.pageNo ++ ;
						this.getListDaily(this.loadMoreAfter(done));
					}else{
						console.log("done1");
						this.loadMoreAfter(done);
					}
				}, 1500)
			},

			// 加载更多
			loadMoreAfter(done){
				if(this.fsp.pageNo >= this.fsp.pageCount){
					done();
					this.$refs.my_scroller.finishInfinite(true);
				}else{
					done();
				}
			},
		}
  	}
</script>

<style lang="scss">
  	#daily-list {
		height: 100%;
		background: #F5F5F5;

		.vux-header-right{
			right: 8px;
			top: 8px;

			svg{
				fill: #fff;
			}
		}

		.scrollerWrap {
			position: absolute;
			width: 100%;
			height: calc(100% - 46px);
			top: 46px;
			bottom: 20px;

			.list_group .weui-cells{
				margin: 0 !important;

				.vux-swipeout-item::after{
					content: ' ';
					display: block;
					height: 1px;
					background: #D9D9D9;
					width: 100vw;
					position: absolute;
					transform-origin: 0 0;
					transform: scaleY(0.5);
					left: 0;
					top: 0;
				}
			}
		}

		.box {
			width: calc(100vw - 40px);
			display: flex;
		}

		.box div {
			text-align: left;
		}

		.box > div:nth-child(1) {
			padding-right: 2px;
			text-align: left;
			width: 80px;
		}

		.box > div:nth-child(2) {
			width: calc(100% - 82px);
			margin-left: 5px;
			overflow: hidden;
			flex-grow: 1;
		}
	}
</style>