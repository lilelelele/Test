
/** 权限列表
    authList: [
        '模块::页面::按钮',
        'plan', //投放计划模块页面
        'plan::add', //投放计划模块下的添加页面
        'plan::add::name', //投放计划模块下添加页面的name输入框
        'plan::add::create_customer', //投放计划模块下添加页面的创建客户按钮
        'plan::add::submit', //投放计划模块下添加页面的提交按钮
        'plan::edit', //投放计划模块下的编辑页面
        '...',
    ]

    把权限列表设置到仓库
    this.$store.commit('setAuthList',authList);
*/

"use strict";

import Vue from 'vue';

/**
 * 验证是否具有权限
 * @param String auth 需要验证的权限 如'plan::add'
 * @returns Boolean true || false
 * @example
    <dom v-if="$canAuth('plan::add')" />
 */
Vue.prototype.$canAuth = function(auth){
    let authList = this.$store.state.authList || [];
    return authList.indexOf(String(auth)) != -1 ? true : false;
};

/**
 * 函数调用方式验证权限
 * @param String auth 需要验证的权限 如'plan::add'
 * @param Function success 成功的回调
 * @param Function error 失败的回调
 * @returns Boolean false
 * @example
    this.$auth('plan::add', () => {
        this.getDataList();
    }, () => {
        this.$router.go(-1);
    });
 */
Vue.prototype.$auth = function(auth, success, error){
    if(this.$canAuth(auth)){
        'function' === typeof success ? success() : !1;
    } else {
        'function' === typeof error ? error() : !1;
    };

    return false;
};

/**
 * 注册VUE全局权限指令 `v-auth`
 * @param String 需要验证的权限 如'plan::add'
 * @example
    <dom v-auth="'plan::add'" />
 */
Vue.directive('auth', {
    bind: (el, param, vnode) => {
        let that = vnode.context,
        value = param.value,
        state = that.$canAuth(value);
        that.$nextTick(()=>{
          !state ? el.parentNode.removeChild(el) : !1;
        });
    }
});