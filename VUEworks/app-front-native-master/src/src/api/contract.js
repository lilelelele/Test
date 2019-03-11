import { axios } from '../config'

// 获取合同数据字典
export function getDict(){
    return axios.post('/contract/dict');
};

// 获取后台列表数据
export function getList(url, param){
    return axios.post(url, param);
};

// 获取单个合同信息
export function find(param){
    return axios.post('/contract/find', param);
};

//验证签名密码
export function checkSig(param) {
    return axios.post('/sig/check', param);
};

//提交审批意见
export function submitExamine(param) {
    return axios.post('/contract/examine', JSON.stringify(param));
};