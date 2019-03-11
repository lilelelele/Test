/**
 * 将val转换为小数
 * @param mixed val 被转换的值
 * @param integer len 精确位数
 * @return float 转换后的值
 */
// export function toDecimal(val){
// 	let tmp = 0, type = typeof(val);

// 	if(val && (type == 'string' || type == 'number')){
// 		val = Number(val);
// 		return val;
// 	} else {
// 		return '';
// 	};
// 	return tmp;
// }

/**
 * 验证是否指定位数的小数值，默认小数11位
 * 整数不能以0开头，小数可以0开头
 */
export function isDouble(v, l = 11){
	let reg = new RegExp('^([1-9]\\d*|0)(\\.\\d{0,'+ l +'})?$');
	return reg.test(v) && isNumber(v);
}

/**
 * 验证是否汉字、大小字母、数字
 */
export function isMixed(val){
	let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi;
	return reg.test(val);
}

/**
 * 验证大小字母、数字
 */
export function isAlphanumeric(val){
	let reg = /^[A-Za-z0-9]+$/gi;
	return reg.test(val);
}

/**
 * 验证是否数值(包含小数)
 */
export function isNumber(val){
	let reg = /^\d+(\.\d+)?$/;
	return reg.test(val);
}

/**
 * 验证是否整数(不含小数)
 */
export function isInteger(val){
	let reg = /^\d+?$/;
	return reg.test(val);
}

/**
 * 验证是否邮箱
 */
export function isEmail(val){
	let reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
	return reg.test(val);
}

/**
 * 验证是否电话
 */
export function isTel(val){
	let reg1 = /^1(3|4|5|7|8)\d{9}$/, reg2 = /^0\d{2,3}\-\d{7,8}(\d{1,6})?$/;
	return reg1.test(val) || reg2.test(val);
}

/**
 * 验证分秒格式
 * as [16:54]
 */
export function isMinuteSecond(val){
	let reg = /^([0-9]{1,3}\d):([0-5][0-9])$/;
	return reg.test(val);
}

/**
 * 验证是否time时间(只验证格式，不验证是否大于时间值)
 * as [2017-09-19 17:21:55] [2017/09/19 17:21:55]
 */
export function isTime(val){
	let reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
	return reg.test(val);
}

/**
 * 去除前后空格
 */
export function trim(val){
	return val.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 转换为数值
 */
export function toNumber(val){
	val = val.toString();
	return val[1] ? val : '0' + val;
}

/**
 * 转换为日期时间格式
 * @param int f 1:日期 其他:日期时间
 */
export function toTime(v, f){
	v = v instanceof Date ? v : new Date(Date.parse(v.replace(/-/g,'/')));
	let y = v.getFullYear(), m = v.getMonth() + 1, d = v.getDate(), h = v.getHours(), i = v.getMinutes(), s = v.getSeconds(), date = [y, m, d].map(toNumber).join('-'), time = [h, i, s].map(toNumber).join(':'), res = f == 1 ? date : date + ' ' + time;
	return v && v != 'Invalid Date' ? res : false;
}

/**
 * 添加事件，兼容IE
 * @param dom      dom      事件对象
 * @param string   type     事件名
 * @param fn       callback 回调函数
 */
export function addEvent(obj, type, callback){
	if(obj.addEventListener){
		obj.addEventListener(type, callback, !1);
	} else if(obj.attachEvent){
		obj.attachEvent('on'+type, callback);
	} else {
		obj['on' + type] = callback;
	};
};

export function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

/**
 * 数组去重
 */
export function array_unique(arr){
	let newArr = [];
	let obj = {};
	for (let i = 0; i < arr.length; i++) {
		if (!obj[typeof arr[i] + arr[i]]) {
			obj[typeof arr[i] + arr[i]] = 1;
			newArr.push(arr[i]);
		}
	}
	return newArr;
};

//判断是否是IE浏览器，包括Edge浏览器  
export function IEVersion(){
	let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
	let isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
	if( isIE ){
		let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		let fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion == 7) {
			return "IE7";
		} else if (fIEVersion == 8) {
			return "IE8";
		} else if (fIEVersion == 9) {
			return "IE9";
		} else if (fIEVersion == 10) {
			return "IE10";
		} else if (fIEVersion == 11) {
			return "IE11";
		} else {
			return "0";
		};//IE版本过低
	} else if (isEdge) {
		return "Edge";
	} else {
		return "-1";//非IE
	};
}

/**
 * 通过类名获取元素标签
 */
export function getClass(className){
	return document.getElementsByClassName(className);
};