import axios from "../../assets/request/http"; // 导入http中创建的axios实例

axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 本地对接接口
let url = process.env.VUE_APP_BASEURL;
// let url = "http://192.168.100.36:21002/invoker/";

const SCREEN = {
	// 登录
	login(params) {
		return axios.post("login", params);
	},
	//发送验证码 use 1注册2找回密码3登录
	sendCode(mobile, use) {
		return axios.get(`smsCode/${mobile}/${use}`)
	},
	//修改、忘记密码
	changePassword(params) {
		return axios.post("changePwd", params)
	},
	// 查询用户信息
	queryUserInfo(params) {
		return axios.post("queryUserInfo", params);
	},
	// 查询场次的大屏拍卖配置
	queryMeetingConfig(meetingId) {
		return axios.post(`${url}auction/screen/queryMeetingConfig/${meetingId}`);
	},
	// 查询场次列表
	queryPageByMeeting(params) {
		return axios.post(`${url}auction/member/queryPageByMeeting`, params);
	},
	// 查询屏幕当前正在拍卖的批次
	queryLotInfoByMeetingScreen(screenId) {
		return axios.post(`${url}auction/member/queryLotInfoByMeetingScreen/${screenId}`);
	},
	// 查询当前用户场次的所有竞价记录
	queryBidByMeeting(meetingId) {
		return axios.post(`${url}auction/member/queryBidByMeeting/${meetingId}`);
	},
	// 竞价 / 下单
	bidding(params) {
		return axios.post(`${url}auction/member/bidding`, params);
	},
	// 获取当前批次竞价记录（增价）
	queryBidByBatch(params) {
		return axios.post(`${url}auction/member/queryBidByBatch`, params);
	}
}

export default {
	SCREEN
}