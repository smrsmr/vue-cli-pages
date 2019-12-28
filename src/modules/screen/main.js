import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import animate from "animate.css";
import Axios from "../screen/assets/request/http";
import Api from "../screen/assets/api/api";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../screen/assets/css/base.css";
import "@babel/polyfill";
Vue.use(ElementUI);
Vue.use(animate);
Vue.prototype.$axios = Axios;
Vue.prototype.$api = Api;
//lodash
import _ from "lodash";
Vue.prototype._ = _;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	let token = localStorage.getItem("token");
	let path = to.path;
	if (token) {
		if (path === "/login") {
			next("/screen-info/auctionIndex");
		} else {
			next();
		}
	} else {
		if (path === "/login" || path === "/forgotPassword") {
			next();
		} else {
			let fullPathUrl = to.fullPath;
			localStorage.setItem("fullPathUrl", fullPathUrl);
			localStorage.removeItem("isRules"); //清除userName
			next("/login");
		}
	}
});
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");