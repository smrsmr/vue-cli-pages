import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/login/login.vue"),
      meta: {
        // 页面标题title
        title: "登录",
        keepAlive: false
      }
    },
    //找回密码
    {
      path: "/forgotPassword",
      name: "forgotPassword",
      component: () => import("./views/forgot-password/ForgotPassword.vue"),
      meta: {
        keepAlive: false,
        title: "找回密码"
      }
    },
    {
      path: "/screen-info/auctionIndex",
      name: "auctionIndex",
      component: () => import("./views/screen-info/auctionIndex.vue"),
      meta: {
        // 页面标题title
        title: "拍卖场次信息",
        keepAlive: false
      }
    },
    {
      path: "/screen-info/screen",
      name: "screen",
      component: () => import("./views/screen-info/Screen.vue"),
      meta: {
        // 页面标题title
        title: "大屏显示",
        keepAlive: false
      }
    },
    {
      path: "/screen-control/ScreenIndex",
      name: "screen-control",
      component: () => import("./views/screen-control/ScreenIndex.vue"),
      meta: {
        // 页面标题title
        title: "大屏控制",
        keepAlive: false
      }
    }
  ]
});
