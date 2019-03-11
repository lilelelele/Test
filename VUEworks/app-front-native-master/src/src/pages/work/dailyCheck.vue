<template>
	<div id="daily-check">
		<x-header>
			{{$route.meta.title}}
		</x-header>

        <group>
            <selector class="user-search" :options="userCommon" v-model="user" @on-change="userChange" direction="rtl" placeholder="请选择成员" title="成员筛选" />
        </group>

		<div class="scrollerWrap" v-show="datas.length > 0">
			<scroller class="scroller_class" height="100%" :on-refresh ="refresh" :noDataText="noDataText" :on-infinite="loadMore" ref="my_scroller">
				
				<group class="list_group">
					<swipeout>
						<swipeout-item transition-mode="follow" v-for=" item in datas" :key="item.id" disabled>
							<cell slot="content" primary="content" :link="{path:'/work/dailyView',query:{id:item.id}}">
								<div class="box">
									<div v-if="!user">
                                        <span>{{item.dayDate}}</span>
                                        <span>{{item.nickname}}</span>
                                    </div>
                                    <div v-else>{{item.dayDate}}</div>
									<div>{{item.memo}}</div>
								</div>
							</cell>
						</swipeout-item>
					</swipeout>
				</group>
				
			</scroller>
		</div>

		<div class="empty-content" v-if="datas.length === 0">
			暂无数据
		</div>
	</div>
</template>
<script>

	import { _fspBean, checkDaily, delDaily, userList } from "../../api/work";
	import { Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton, Selector } from 'vux'

  	export default {
		components: { Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton, Selector },
	
		data: function(){
			return{
				fsp: _fspBean,
				datas: [],
                noDataText: "",
                
                // 用户待选列表
                userCommon: [],

                // 已选用户
                user: 0
			}
		},

		// 路由进入
		beforeRouteEnter(to, from, next){
			
			// 日报详情使用的是同一个页面，所以需要区分状态是否可操作
			vm.$store.commit('setCensor', false);
			
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
        
        created (){
            this.getUserlist();
        },

		mounted (){
			this.refresh();
		},
	
		methods: {
            // 获取某个成员的日报列表
			getListDaily(foo) {
                this.fsp.map.owner = this.user;
                checkDaily(this.fsp).then(res => {
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

			// 查询当前登录用户的部门成员
			getUserlist (){
				userList().then(res => {
                    if(1 === res.data.status){
                        let list = [{key: 0, value: '所有成员'}];
                        for(let i in res.data.element){
                            list.push({
                                key: i,
                                value: res.data.element[i]
                            });
                        };
                        this.userCommon = list;
                    };
				});
            },
            
            // 成员切换
            userChange (){
                this.datas = [];
                this.refresh();
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
  	#daily-check {
		height: 100%;
		background: #F5F5F5;

		.vux-header-right{
			right: 8px;
			top: 8px;

			svg{
				fill: #fff;
			}
		}

        .weui-cells{
            margin: 0 !important;

            .user-search{
                background: #f5f5f5;
            }
        }

		.scrollerWrap {
			position: absolute;
			width: 100%;
			height: calc(100% - 89px);
			top: 89px;
			bottom: 20px;

			.list_group{

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

		.empty-content{
			padding: 20px 0;
			text-align: center;
			color: #ccc;
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

            span{
                width: 100%;
                height: 20px;
                line-height: 20px;
                display: block;
                text-align: center;
                float: left;
            }
		}

		.box > div:nth-child(2) {
			width: calc(100% - 82px);
			margin-left: 5px;
			overflow: hidden;
			flex-grow: 1;
		}
	}
</style>