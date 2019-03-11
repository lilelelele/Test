<template>
    <div class="contract-list-page">
        <x-header>
            {{selected.name}}
            <x-icon slot="right" type="ios-search" size="25" style="fill:#fff;top:8px;right:8px;" @click.native="searchClick" />
        </x-header>

        <scroller lock-x height="calc(100vh - 90px)" ref="scroller" style="z-index:1;"
            use-pulldown :pulldown-config="pulldownConfig" @on-pulldown-loading="refresh"
        >
            <div class="content-box">
                <swipeout>
                    <div class="empty-box" v-if="0 === list.length">
                        暂无数据
                    </div>

                    <swipeout-item transition-mode="follow" disabled v-for="(row, index) in list" :key="index">
                        <div slot="content" class="row-box">
                            <div class="row-main">
                                <div class="ctime-code">
                                    <span>{{row.ctime}}年</span>
                                    <span>{{row.categoryStr}}</span>
                                    <span>{{row.contractCode}}</span>
                                </div>

                                <h2>{{row.name}}</h2>
                                <h4>{{row.company}}</h4>

                                <div class="deadline">
                                    {{row.startDate}} 至 {{row.endDate}}
                                </div>
                            </div>
                            <div class="row-footer" @click="$router.push('/contract/detail?id=' + row.id)">
                                <span :class="'status-' + row.status">{{row.actvieNode}}</span>
                                <span>{{'-1' === row.amount1 ? '框架' : row.amount1}}</span>
                                <x-icon type="ios-arrow-right" size="25" />
                            </div>
                        </div>

                        <div slot="right-menu">
                            <swipeout-button type="warn">删除</swipeout-button>
                        </div>
                    </swipeout-item>
                </swipeout>
            </div>
        </scroller>

        <tab class="menus-layout" :scroll-threshold="5">
            <tab-item v-for="item in menus" :key="item.value" :selected="item.value === selected.value" @on-item-click="tabClick(item)">{{item.name}}</tab-item>
        </tab>

        <div :class="{'search-mask':true, 'to-left':openMask, 'to-right':!openMask}" v-if="dict" @click.self="openMask = !openMask">
            <div class="panel">
                <div class="item-layout keyword-search">
                    <x-input v-model="fsp.map.likeSearch" placeholder="合同名称、经办人、部门、等" :show-clear="true" />
                </div>

                <div class="item-layout panel-year">
                    <selector :options="dict.a_time" v-model="fsp.map.time" placeholder="请选择" />
                </div>

                <div class="item-layout panel-category">
                    <selector :options="dict.a_category" v-model="fsp.map.category" placeholder="请选择" />
                </div>

                <div class="item-layout panel-amount">
                    <selector :options="dict.a_amount" v-model="fsp.map.amount" placeholder="请选择" />
                </div>

                <div class="item-layout panel-nodes">
                    <selector :options="dict.a_nodes" v-model="fsp.map.node" placeholder="请选择" />
                </div>

                <div class="btn-box">
                    <span @click="resetSearch">重置</span>
                    <span @click="refresh">完成</span>
                </div>
            </div>
        </div>

        <loading v-if="loading" :show="true" text="loading..." style="z-index:10;" />
    </div>
</template>

<script>
    import { XHeader, Tab, TabItem, Scroller, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Selector, Loading } from 'vux'
    import { getDict, getList } from '../../api/contract'

    export default {
        components: { XHeader, Tab, TabItem, Scroller, LoadMore, Swipeout, SwipeoutItem, SwipeoutButton, XInput, Selector, Loading },

        data (){
            return {
                loading: false,

                // 当前选中菜单
                selected: {},

                // 数据字典
                dict: false,

                // 菜单列表
                menus: [
                    // { name:菜单名, value:菜单绑定值, type:相同请求地址的类型区分, url:数据请求地址 }
                    { name: '待审核', value: 1, type: null, url: '/contract/listDb' },
                    { name: '我的', value: 2, type: 1, url: '/contract/list' },
                    { name: '已完成', value: 3, type: 2, url: '/contract/list' },
                    { name: '已废弃', value: 4, type: 3, url: '/contract/list' },
                    { name: '全部', value: 5, type: null, url: '/contract/listAll' },
                ],

                // 搜索面板是否展开
                openMask: false,

                // 搜索条件
                fsp: {
                    map: {
                        likeSearch: null, //关键词搜索 (合同名称, 类别, 合同性质, 经办人, 部门, 等)
                        status: '', //相同请求接口的类型区分
                        time: null, //年度筛选
                        category: null, //合同类型筛选
                        amount: null, //合同金额筛选
                        node: null, //进度筛选
                    },
                    pageNo: 1,
                    pageSize: 1,
                    recordCount: 0,
                },

                // 合同数据列表
                list: [],

                pulldownConfig: {
                    content: '下拉刷新',
                    height: 40,
                    autoRefresh: false,
                    downContent: '下拉刷新',
                    upContent: '释放后刷新',
                    loadingContent: '正在刷新...',
                    clsPrefix: 'xs-plugin-pulldown-'
                }
            }
        },

        created (){
            this.getDict();
            this.tabClick(this.menus[0]); // 设置默认选中项
        },

        mounted() {
            this.$nextTick(() => {
                this.$refs.scroller.reset({top: 0})
            });
        },

        methods: {

            // 获取数据字典
            getDict (){
                getDict().then(res => {
                    if(1 === res.data.status){
                        this.dict = res.data.element;


                        // 年度
                        this.dict.a_time = this.toArray(this.dict.time);

                        // 合同类型
                        this.dict.a_category = this.toArray(this.dict.category);

                        // 合同金额
                        this.dict.a_amount = this.toArray(this.dict.amount);

                        // 当前进度
                        this.dict.a_nodes = this.toArray(this.dict.nodes);
                    } else {
                        this.$vux.toast.text('数据字典获取失败~', 'top');
                    };
                });
            },

            // 将对象转换为数组
            toArray ( obj ){
                let list = [];
                for (let key in obj) {
                    list.push({
                        key: key,
                        value: obj[key]
                    });
                };
                return list;
            },

            // 搜索按钮被点击
            searchClick (){
                this.openMask = !this.openMask;
                console.log(this.openMask);
            },

            // 某个tab被点击
            tabClick (item){
                if(this.selected.value === item.value){
                    return false;
                };

                this.selected = item;
                this.resetSearch();
                this.refresh();
            },

            // 请求数据
            fetchData (cb){
                this.loading = true;
                this.fsp.map.status = this.selected.type;
                getList(this.selected.url, this.fsp).then(res => {
                    this.$nextTick(() => {
                        this.$refs.scroller.reset();
                    });
                    
                    if(1 === res.data.status){
                        cb(res.data.datas);
                        this.fsp = res.data.fsp;
                    } else {
                        this.$vux.toast.text(res.data.msg, 'top');
                    };
                    this.loading = false;
                });
            },

            // 刷新数据
            refresh (){
                console.log('刷新数据');
                this.fetchData(data => {
                    this.list = data;
                    this.openMask = false;
                    this.$refs.scroller.donePulldown();
                });
            },

            // 重置搜索条件
            resetSearch (){
                let search = this.fsp.map;

                search.likeSearch = '';
                search.time = null;
                search.category = null; //合同类型筛选
                search.amount = null; //合同金额筛选
                search.node = null; //进度筛选
            }
        }
    }
</script>


<style lang="scss">
    .contract-list-page{
        width: 100vw;
        height: 100vh;
        background: #EAEAEA;

        .weui-mask_transparent{
            width: 100vw;
            height: 100vh;
        }

        .menus-layout{
            width: 100vw;
            position: fixed;
            bottom: 0;
            z-index: 1;

            .vux-tab-item{
                background: linear-gradient(180deg, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0)) top left no-repeat;
                background-size: 100% 1px;
            }
        }

        .content-box{
            padding: 5px;
            box-sizing: border-box;

            .empty-box{
                width: 100vw;
                height: 100px;
                line-height: 100px;
                text-align: center;
                color: #ccc;
            }

            .vux-swipeout-content{
                background: unset;
            }

            .row-box{
                margin-bottom: 5px;
                background: #fff;
                border-radius: 5px;
                overflow: hidden;

                .row-main{
                    padding: 15px 10px 0 10px;

                    .ctime-code{
                        >span{
                            border-radius: 50px;
                            background: #eee;
                            color: #999;
                            padding: 3px 7px;
                        };

                        >span:nth-child(3){
                            float: right;
                        }
                    }

                    h2{
                        font-size: 18px;
                        color: #333;
                        margin: 10px 0;
                    }

                    h4{
                        font-weight: 100;
                        color: #999;
                        margin: 0;
                    }

                    .deadline{
                        margin: 5px 0;
                        padding: 2px 0;
                        color: #999;
                        font-size: 16px;
                    }

                    .actvie-node{
                        height: 23px;
                        margin-top: 10px;

                        span{
                            color: #fff;
                            padding: 2px 7px;
                            border-radius: 50px;
                            float: right;
                        }

                        
                    }
                }

                .row-footer{
                    height: 44px;
                    position: relative;
                    border-top: 1px solid #f5f5f5;
                    color: #999;

                    >span{
                        position: absolute;
                        top: 11px;
                    }

                    span:nth-child(1){
                        left: 10px;
                        padding: 1px 7px;
                        border-radius: 50px;
                        color: #fff;

                        // 有意见
                        &.status-1{
                            background: #A8A20D;
                        }

                        // 驳回
                        &.status-2{
                            background: #DB6B3B;
                        }

                        // 终止
                        &.status-3{
                            background: #DB3B3B;
                        }

                        // 无意见
                        &.status-4{
                            background: #3B77DB;
                        }
                    }

                    span:nth-child(2){
                        right: 30px;
                        color: red;
                        font-weight: bold;
                        font-size: 1.4em;
                        top: 10px;
                    }
                        
                    >svg{
                        position: absolute;
                        top: 9px;
                        right: 5px;
                        fill: red;
                    }
                }
            }
        }

        .xs-plugin-pulldown-container {
            line-height: 40px;
        }

        .xs-plugin-pullup-container {
            line-height: 40px;
        }

        .search-mask{
            width: 100vw;
            height: calc(100vh - 46px);
            position: fixed;
            top: 46px;
            background: rgba(0, 0, 0, .5);
            transition: all 300ms;
            opacity: 0;

            &.to-left{
                opacity: 1;
                z-index: 5;

                .panel{
                    transform: translateX(0);
                }
            }

            &.to-right{
                opacity: 0;
                z-index: 0;

                .panel{
                    transform: translateX(80vw);
                }
            }

            .panel{
                width: 80vw;
                height: 100%;
                background: #fff;
                transition: all 200ms;
                position: absolute;
                top: 0;
                right: 0;

                .item-layout{
                    padding: 10px;

                    &::before{
                        color: #999;
                        display: block;
                        margin-bottom: 10px;
                    }

                    .weui-cell{
                        padding: 0 5px;
                        background: #f5f5f5;
                        border-radius: 3px;
                        box-sizing: border-box;
                    }

                    .weui-cell_select{
                        padding: 0;
                        .weui-select{
                            height: 30px;
                            line-height: 30px;
                            padding-left: 5px;
                        }
                    }
                }

                .keyword-search::before{
                    content: '关键字';
                }

                .panel-year::before{
                    content: '年度';
                }

                .panel-category::before{
                    content: '合同类型';
                }

                .panel-amount::before{
                    content: '合同金额';
                }

                .panel-nodes::before{
                    content: '当前进度';
                }

                .btn-box{
                    width: 100%;
                    height: 44px;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    z-index: 5;

                    span{
                        height: 44px;
                        line-height: 44px;
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        float: left;

                        &:nth-child(1){
                            width: 40%;
                            background: #FAE8E9;
                            color: #E13F3F;
                        }

                        &:nth-child(2){
                            width: 60%;
                            background: #DD2627;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>
