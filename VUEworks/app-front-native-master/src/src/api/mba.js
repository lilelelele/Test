import {axios,urlencodedHeader,jsonHeader} from '../config'
import {fspBean} from './model'


export const _fspBean = fspBean;



/*查询全部任务列表*/
export function listAllWf(param){
  return axios.post('/mba/listAllWf',param);
};

/*待办任务列表*/
export function listTodoWf(param){
  return axios.post('/mba/listTodoWf',param);
};

/*我参与过的列表*/
export function listDoneWf(param){
  return axios.post('/mba/listDoneWf',param);
};

/*审核一个工作流节点，包括请假、外出、加班*/
export function examineWfNode(param){
  return axios.post('/mba/examineWfNode',param);
};



/*我提交的请假列表*/
export function listMyLeave(param){
  return axios.post('/mba/listMyLeave',param);
};
/*我提交的外出列表*/
export function listMyVisit(param){
  return axios.post('/mba/listMyVisit',param);
};
/*我提交的加班列表*/
export function listMyOvertime(param){
  return axios.post('/mba/listMyOvertime',param);
};




/**请假相关**/


/*查找一个请假包含审核记录*/
export function findLeave(param){
    return axios.post('/mba/findLeave',param);
};
/*保存一个请假*/
export function saveLeave(param){
    return axios.post('/mba/saveLeave',param);
};

/*取消一个请假*/
export function cancelLeave(param){
    return axios.post('/mba/cancelLeave',param);
};

/**外出相关**/

/*查找一个外出包含审核记录*/
export function findVisit(param){
  return axios.post('/mba/findVisit',param);
};
/*保存一个外出*/
export function saveVisit(param){
  return axios.post('/mba/saveVisit',param);
};

/*取消一个外出*/
export function cancelVisit(param){
  return axios.post('/mba/cancelVisit',param);
};
/**加班相关**/

/*查找一个加班包含审核记录*/
export function findOvertime(param){
  return axios.post('/mba/findOvertime',param);
};
/*保存一个加班*/
export function saveOvertime(param){
  return axios.post('/mba/saveOvertime',param);
};

/*取消一个加班*/
export function cancelOvertime(param){
  return axios.post('/mba/cancelOvertime',param);
};






/**登录人所属项目*/
export function getUsableProjects(param){
    return axios.post('/mb/getUsableProjects',param);
};