import {axios,urlencodedHeader,jsonHeader} from '../config'
import {fspBean} from './model'


export const _fspBean = fspBean;


/**项目相关**/
/*项目列表*/
export function listProject(param){
  return axios.post('/mb/listProject',param);
};
/*查找一个项目*/
export function findProject(param){
  return axios.post('/mb/findProject',param);
};
/*保存一个项目*/
export function saveProject(param){
  return axios.post('/mb/saveProject',param);
};
/*删除一个项目*/
export function delProject(param){
  return axios.post('/mb/delProject',param);
};
/**登录人所属项目*/
export function getUsableProjects(param){
  return axios.post('/mb/getUsableProjects',param);
};


/*项目版本列表*/
export function listProjectVersion(param){
  return axios.post('/mb/listProjectVersion',param);
};
/*查找一个项目版本*/
export function findProjectVersion(param){
  return axios.post('/mb/findProjectVersion',param);
};
/*保存一个项目版本*/
export function saveProjectVersion(param){
  return axios.post('/mb/saveProjectVersion',param);
};
/*删除一个项目版本*/
export function delProjectVersion(param){
  return axios.post('/mb/delProjectVersion',param);
};

/*版本事件列表*/
export function listVersionRecord(param){
  return axios.post('/mb/listVersionRecord',param);
};
/*查找一个版本事件*/
export function findVersionRecord(param){
  return axios.post('/mb/findVersionRecord',param);
};
/*保存一个版本事件*/
export function saveVersionRecord(param){
  return axios.post('/mb/saveVersionRecord',param);
};
/*删除一个版本事件*/
export function delVersionRecord(param){
  return axios.post('/mb/delVersionRecord',param);
};



/**日报相关**/
/*日报列表*/
export function listDaily(param){
  return axios.post('/mb/listDaily',param,
            {
                headers: {
                      //'authToken': localStorage.getItem('jsessionid'),

                },
            }
          );
};
/*审查日报列表*/
export function checkDaily(param){
  return axios.post('/mb/checkDaily',param);
};
/*查找一个日报*/
export function findDaily(param){
  return axios.post('/mb/findDaily',param);
};
/*保存一个日报*/
export function saveDaily(param){
  return axios.post('/mb/saveDaily',param);
};
/*删除一个日报*/
export function delDaily(param){
  return axios.post('/mb/delDaily',param);
};
/*获得自动项目编*/
export function autoProjectCode(param){
  return axios.post('/mb/autoProjectCode',param);
};

/*日报明细列表*/
export function listDailyDetail(param){
  return axios.post('/mb/listDailyDetail',param);
};
/*查找一个日报明细*/
export function findDailyDetail(param){
  return axios.post('/mb/findDailyDetail',param);
};
/*保存一个日报明细*/
export function saveDailyDetail(param){
  return axios.post('/mb/saveDailyDetail',param);
};
/*删除一个日报明细*/
export function delDailyDetail(param){
  return axios.post('/mb/delDailyDetail',param);
};
/*删除一个日报明细
export function getUsableProjects(param){
  return axios.post('/mb/getUsableProjects',param);
};*/
/*得到本部门人员列表*/
export function fetchPersons(param){
  return axios.post('/mb/fetchPersons',param);
};


/*外出相关*/
/*查询外出列表*/
export function listVisit(param){
  return axios.post('/visit/list', param);
}
/*查询审批列表*/
export function listCheckVisit(param){
  return axios.post('/visit/checkList', param);
}
/*保存外出申请*/
export function saveVisit(param){
  return axios.post('/visit/save', param);
}
/*初始化数据*/
export function initVisit(){
  return axios.post('/visit/init');
}
/*查询外出申请*/
export function findVisit(param){
  return axios.post('/visit/find', param);
}
/*删除*/
export function delVisit(param){
  return axios.post('/visit/del', param);
}
/*查询当前登录用户的部门成员*/
export function userList(param){
  return axios.post('/visit/users');
}












