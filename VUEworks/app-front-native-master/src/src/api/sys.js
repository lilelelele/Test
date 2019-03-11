import {axios,urlencodedHeader,jsonHeader} from '../config'
import {fspBean} from './model'


export const _fspBean = fspBean;

//得到菜单列表
export function listMenu(){
    return axios.post('/sys/listMenu');
};

/**权限树页面相关**/
//查找一颗权限树
export function findPermissionTree(){
    return axios.post('/sys/findPermissionTree');
};

//保存一颗权限树
export function savePermissionTree(param){
    return axios.post('/sys/savePermissionTree', param);
};
//保存权限树中一个节点node
export function savePermissionNode(){
    return axios.post('/sys/savePermissionNode');
};
//删除权限树中一个节点node
export function delPermissionNode(param){
    return axios.post('/sys/delPermissionNode',param);
};


/**角色页面相关**/
//角色列表
export function listRole(param){
    return axios.post('/sys/listRole',param);
};


export function findRole(param){
    return axios.post('/sys/findRole',param);
};
export function saveRole(param){
    return axios.post('/sys/saveRole',param);
};
export function delRole(param){
    return axios.post('/sys/delRole',param);
};
//根据角色查找授权的权限树
export function findRoleAuthorize(param){
    return axios.post('/sys/findRoleAuthorize',param);
};
//角色授权的保存
export function saveRoleAuthorize(param){
    return axios.post('/sys/saveRoleAuthorize',param);
};



/**用户页面相关**/
export function listUser(param){
    return axios.post('/sys/listUser',param);
};
export function listUserWithOrg(param){
    return axios.post('/sys/listUserWithOrg',param);
};
export function listUserNoInThisOrg(param){
    return axios.post('/sys/listUserNoInThisOrg',param);
};
export function findUser(param){
    return axios.post('/sys/findUser',param);
};
//获得全部角色列表
export function listRoleAll(param){
    return axios.post('/sys/listRoleAll',param);
};
//获得启用角色列表
export function listRoleUsable(param){
  return axios.post('/sys/listRoleUsable',param);
};
export function saveUser(param){
    return axios.post('/sys/saveUser',param);
};
export function delUser(param){
    return axios.post('/sys/delUser',param);
}
//重置用户密码
export function resetUserPw(param){
    return axios.post('/sys/resetUserPw',param);
};
//用户修改保存密码
export function passwdSave(param){
  return axios.post('/sys/passwdSave',param);
};

/**组织机构页面相关**/
export function findOrgTree(param){
    return axios.post('/sys/findOrgTree',param);
};
export function saveOrgTree(param){
    return axios.post('/sys/saveOrgTree',param);
};
export function delOrgNode(param){
    return axios.post('/sys/delOrgNode',param);
};
export function addUserToOrg(param){
    return axios.post('/sys/addUserToOrg',param);
};
export function removeUserToOrg(param){
    return axios.post('/sys/removeUserToOrg',param);
};
export function changeOrgManager(param){
    return axios.post('/sys/changeOrgManager',param);
};


// 签到
export function requestSignIn(param){
    return axios.post('/mba/signIn', param);
};