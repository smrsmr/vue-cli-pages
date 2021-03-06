import Vue from "vue"
import App from "./App.vue"
import ElementUI from "element-ui"
import router from "./router"
import store from "./store";
import Axios from "./assets/request/http";
import Api from "./assets/api/api";
Vue.config.productionTip = false
import "element-ui/lib/theme-chalk/index.css";
import "./assets/less/base.less";
import "./assets/less/vars.less";
import Fun from "./assets/utils/public";
Vue.prototype.$axios = Axios;
Vue.prototype.$api = Api;
Vue.prototype.$fun = Fun;
Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
	// 路由发生变化修改页面title
	if (to.name) {
		document.title = to.name;
	}
	next();
});
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount("#app")