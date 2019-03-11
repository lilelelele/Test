<template>
    <div class="contract-detail-page">
        <x-header>
            合同详情
        </x-header>

        <div class="detail-content">
            <group>
                <x-input readonly title='审批表编号'  v-model="data.censorCode" placeholder-align="right" text-align="right" />
                <x-input readonly title='经办部门'  v-model="data.sysOrgName" placeholder-align="right" text-align="right" />
                <x-input readonly title='经办人'  v-model="data.sysUserName" placeholder-align="right" text-align="right" />
                <x-input readonly title='责任人'  v-model="data.responsible" placeholder-align="right" text-align="right" placeholder="未填写" />
                <x-input readonly title='合同名称'  v-model="data.name" placeholder-align="right" text-align="right" placeholder="未填写" />
                <x-input readonly title='签约单位'  v-model="data.company" placeholder-align="right" text-align="right" placeholder="未填写" />
                <cell title="对方资质">
                    <span v-if="!data.qualificationFile">未上传</span>
                    <span v-else style="color:#1AAD19;" @click="$refs.previewer.show(0)">预览</span>
                </cell>
                <x-input readonly title='合同性质'  v-model="data.property" placeholder-align="right" text-align="right" placeholder="未填写" />
                <x-input readonly title='合同类别'  v-model="data.category" placeholder-align="right" text-align="right" />
                <x-input readonly title='合同编号'  v-model="data.contractCode" placeholder-align="right" text-align="right" />
                <x-input readonly title='合同期限'  v-model="data.dateSet" placeholder-align="right" text-align="right" placeholder="未填写" />
                <x-input readonly title='合同金额'  v-model="data.amount1" placeholder-align="right" text-align="right" />
                <x-textarea readonly title="合同主要内容与重要条款" autosize v-model="data.content" placeholder="未填写" />
                <x-textarea readonly title="合同简要说明" autosize v-model="data.summary" placeholder="未填写" />
                <cell title="合同文件" v-if="examineList.length > 0" :inline-desc="examineList[0].index">
                    <span style="color:#1AAD19;" @click="setCurrPdf(examineList[0])">下载预览</span>
                </cell>
            </group>

            <div v-for="(item, index) in examineList" :key="index">
                <group v-if="index > 0">
                    <div class="division" />
                    <x-input readonly title='审批'  v-model="item.wfdNodeName" placeholder-align="right" text-align="right" />
                    <x-input readonly title='日期'  v-model="item.date" placeholder-align="right" text-align="right" />
                    <selector readonly :options="examineStatus" v-model="item.status" direction="rtl" placeholder="请选择" title="审批状态" />
                    <x-textarea readonly title="审批意见" autosize v-model="item.opinion" placeholder="请填写您的审批意见" />
                    <cell title="合同文件" :inline-desc="item.index">
                        <span style="color:#1AAD19;" @click="setCurrPdf(examineList[index])">下载预览</span>
                    </cell>
                </group>
            </div>

            <div class="division" v-if="data.isExamine && 100 !== data.actvieNode" />

            <group v-if="data.isExamine && 100 !== data.actvieNode">
                <x-input readonly title='审批'  v-model="examineForm.wfdNodeName" placeholder-align="right" text-align="right" />
                <x-input readonly title='日期'  v-model="examineForm.date" placeholder-align="right" text-align="right" />
                <selector :options="examineStatus" v-model="examineForm.status" @on-change="examineStatusChange" direction="rtl" placeholder="请选择" title="审批状态" />
                <x-textarea title="审批意见" autosize v-model="examineForm.opinion" :disabled="examineForm.status == 4 || !examineForm.status" placeholder="请填写您的审批意见" />
                <x-button type="primary" :disabled="!examineForm.status || !examineForm.opinion" @click.native="contractSubmit">审批提交</x-button>
            </group>
        </div>

        <div v-transfer-dom>
            <previewer :list="[{src:data.qualificationFile}]" ref="previewer" />
        </div>

        <loading v-if="loading" :show="true" text="loading..." style="z-index:10;" />
    </div>
</template>

<script>

    import { XHeader, Group, Cell, XInput, XTextarea, LoadMore, Selector, XButton, Previewer, TransferDom, Loading } from 'vux'
    import { getDict, find, checkSig, submitExamine } from '../../api/contract'
    import env from '../../other/env'
import { trim } from '../../util';

    export default {

        directives: {
            TransferDom
        },

        components: { XHeader, Group, Cell, XInput, XTextarea, LoadMore, Selector, XButton, Previewer, Loading },

        data (){
            return {
                loading: false,

                // 合同id
                id: this.$route.query.id,

                // 数据字典
                dict: {},

                // 合同数据
                data: {},

                // 审批状态
                examineStatus: [
                    {key: 1, value:'有意见'},
                    {key: 2, value:'驳回'},
                    {key: 3, value:'终止'},
                    {key: 4, value:'无意见'},
                ],

                //审批表单
                examineForm: {},

                //审批结果列表
                examineList: []
            }
        },

        created (){
            this.getDict();
            this.find();
        },

        methods: {
            // 获取数据字典
            getDict (){
                getDict().then(res => {
                    if(1 === res.data.status){
                        this.dict = res.data.element;
                    } else {
                        this.$vux.toast.text('数据字典获取失败~', 'top');
                    };
                });
            },

            // 获取合同数据
            find (){
                this.loading = true;
                find(this.id).then(res => {
                    if(1 === res.data.status){
                        this.data = res.data.element;
                        this.data.dateSet = this.data.startDate + ' 至 ' + this.data.endDate;
                        this.data.property = this.dict.property[this.data.property];
                        this.data.category = this.dict.category[this.data.category];
                        this.data.qualificationFile = this.data.qualificationFile ? this.server + '/file/show?fileCode=' + this.data.qualificationFile : '';
                        this.data.actvieNode = Number(this.data.actvieNode);
                        this.data.amount1 = (this.data.amount1 == -1 ? '框架' : this.data.amount1);

                        this.examineList = this.data.examines;
                        this.examineForm = this.data.examines.pop();
                    } else {
                        this.$vux.toast.text(res.data.msg, 'top');
                    };
                    this.loading = false;
                });
            },

            // 审批状态被改变
            examineStatusChange (value){
				let text = '';
				if(4 === value){
					text = '无意见';
				};
				this.examineForm.opinion = text;
            },

            setCurrPdf (row){
				if(!row){
                    this.$vux.toast.text('合同文件异常~', 'top');
					return false;
				};
                
                let path = this.server + '/file/show?fileCode=' + row.pdfName;

                if(env.isCordova()){
                    cordova.InAppBrowser.open(path, '_system', 'location=no');
                } else {
                    window.open(path);
                };
            },
            
            // 审批提交
            contractSubmit (){
                let that = this;

                if (10 === this.data.actvieNode) {
                    this.$vux.toast.text('请到PC端进行归档操作~', 'top');
                    return false;
                };

                this.$vux.confirm.prompt('请输入您的电子签名码', {
                    title: '提示',
                    closeOnConfirm: false,
                    onCancel () {
                        that.$vux.toast.text('您已取消审批', 'top');
                    },
                    onConfirm (code) {
                        code = trim(code);
                        if(!code){
                            that.$vux.toast.text('请输入您的电子签名码', 'top');
                        } else {
                            that.loading = true;
                            that.$vux.confirm.hide();

                            // 验证签名码
                            checkSig(code).then(res => {
                                if(res.data.element){
                                    that.submitExamine();
                                } else {
                                    that.loading = false;
                                    that.$vux.toast.text('您的电子签名码有误，请重新输入！', 'top');
                                    that.$vux.confirm.show();
                                };
                            });
                        };
                    }
                })
            },

            // 提交审批意见
			submitExamine (){
				submitExamine(this.examineForm).then(res => {
					if(res.data.status == 1){
						this.$vux.toast.text('审批成功', 'top');
						this.find();
					} else {
                        this.$vux.toast.text(res.data.msg, 'top');
                        this.loading = false;
					};
				});
			},
        }
    }
</script>

<style lang="scss">
    .contract-detail-page{
        width: 100vw;
        height: 100vh;
        background: #222;

        .vux-header{
            background: #000;
        }

        .detail-content{
            width: 100vw;
            height: calc(100vh - 46px);
            position: fixed;
            overflow-y: auto;

            &>div:last-child{
                margin-bottom: 50px;
            }

            .vux-no-group-title{
                margin-top: 0;
                background: #222;
                color: #c0c4cc;

                &::before, &::after{
                    border-color: #606266;
                    display: none;
                }

                .weui-cell::before{
                    left: 0;
                    border-color: #606266;
                }

                .weui-label{
                    width: 7em !important;
                }

                .weui-textarea{
                    background: #222;
                    text-align: right;
                }

                .vux-cell-primary>p{
                    margin: 0;
                }

                .weui-select, .vux-selector-readonly{
                    color: #c0c4cc;
                }

                .weui-btn{
                    width: 92%;
                }
            }

            .division{
                height: 1px;
                background: #606266;
                position: relative;
                margin: 30px 0 50px 0;

                &::before, &::after{
                    width: 100%;
                    height: 10px;
                    display: block;
                    position: absolute;
                    content: '';
                    background-image:-webkit-gradient(linear, 50% 0, 0 100%, from(transparent), color-stop(.5,transparent), color-stop(.5,#606266), to(#606266)), -webkit-gradient(linear,50% 0,100% 100%,from(transparent), color-stop(.5,transparent),color-stop(.5,#606266), to(#606266));
                    background-size: 18px 9px;
                    background-repeat: repeat-x;
                    background-position: 0 100%;
                }

                &::before{
                    top: -10px;
                }

                &::after{
                    bottom: -10px;
                    background-position: 6px 100%;
                    transform:rotate(180deg);
                }
                
            }
        }
    }
</style>
