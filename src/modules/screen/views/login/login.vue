<template>
  <section class="login">
    <el-row>
      <el-col :span="17" class="login-left"></el-col>
      <el-col :span="7" class="login-right">
        <i class="logo-bac-r">
          <img src="../../assets/images/logo-r.png" alt />
        </i>
        <el-row>
          <el-col :span="9" :push="2" class="mar-t-170">
            <p class="logo"></p>
          </el-col>
          <el-col :span="15" class="mar-t-170">
            <p class="title">中药材拍卖竞价系统</p>
          </el-col>
          <a href="/mall.html/#/backstage/home">前往西北项目</a>
          <el-row>
            <el-col :push="3" class="pad-t-65 tap-nav" :span="17">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户登录" name="account">
                  <el-row>
                    <el-col class="pad-t-49">
                      <el-input placeholder="账号" v-model="accountForm.account">
                        <i slot="prefix" class="icon-img">
                          <img src="../../assets/images/icon_User.png" alt />
                        </i>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="pad-t-20 form-item">
                      <el-input
                        v-model="accountForm.password"
                        type="password"
                        @keyup.enter.native="accountLoginHandle"
                        placeholder="密码"
                        :maxlength="40"
                      >
                        <i slot="prefix" class="icon-img">
                          <img src="../../assets/images/icon_Key.png" alt />
                        </i>
                      </el-input>
                      <router-link to="/forgotPassword" class="forgotPassword">忘记密码</router-link>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="pad-t-20">
                      <el-checkbox v-model="accORpass">记住用户名和密码</el-checkbox>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col class="pad-t-51">
                      <el-button type="primary" class="register" @click="accountLoginHandle" :loading="accountLoadingBtn">登录</el-button>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label name="code" :disabled="true">
                  <el-row>
                    <el-col class="pad-t-30" :push="4" :span="16">
                      <wxlogin :href="wx.href" :state="wx.state" :appid="wx.appid" :scope="wx.scope" :redirect_uri="wx.redirect_uri"></wxlogin>
                    </el-col>
                  </el-row>
                  <!-- <el-row>
                    <el-col class="pad-t-20 scan-code" :span="24">请扫描二维码</el-col>
                  </el-row>-->
                  <el-row>
                    <el-col :span="2" :offset="3">
                      <img src="../../assets/images/c1.png" alt />
                    </el-col>
                    <el-col :span="5" class="pad-l-10" style="line-height:35px;color:rgba(153,153,153,1);">免输入</el-col>
                    <el-col :span="2">
                      <img src="../../assets/images/c2.png" alt />
                    </el-col>
                    <el-col :span="5" class="pad-l-10" style="line-height:35px;color:rgba(153,153,153,1);">更快</el-col>
                    <el-col :span="2">
                      <img src="../../assets/images/c3.png" alt />
                    </el-col>
                    <el-col :span="5" class="pad-l-10" style="line-height:35px;color:rgba(153,153,153,1);">更安全</el-col>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import wxlogin from "vue-wxlogin";
export default {
  name: "login",
  data() {
    return {
      activeName: "account",
      accORpass: false,
      SUCCESS_CODE: 1, //请求成功的值
      SSXT: "server37", //系统名称
      userName: "", //账号
      userPassword: "", //密码
      accountLoadingBtn: false, //账号密码登录按钮loading
      accountForm: {
        //账号表单
        account: "",
        password: ""
      },
      loadingBtn: false, //登录按钮loading
      //编辑密码弹窗表单
      editPasswordForm: {
        editPassword: "",
        editPassword2: ""
      },
      toPath: "/screen-info/auctionIndex",
      wx: {
        // eslint-disable-next-line
        self_redirect: false,
        id: "qrcode",
        appid: "wxe19e3e2415e89353",
        scope: "snsapi_login",
        // eslint-disable-next-line
        redirect_uri: encodeURIComponent("http://www.coolarch.net/Mingzhu/wechat/callBack"),
        state: "1211111",
        style: "black",
        href: ""
      }
    };
  },
  components: { wxlogin },
  mounted() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
    // 组件初始化的时候判断本地缓存有没有记住的账号密码
    localStorage.getItem("account") !== null ? (this.accountForm.account = JSON.parse(localStorage.getItem("account"))) : "";
    localStorage.getItem("password") !== null ? (this.accountForm.password = JSON.parse(localStorage.getItem("password"))) : "";
    localStorage.getItem("accORpass") !== null ? (this.accORpass = JSON.parse(localStorage.getItem("accORpass"))) : false;
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "code") {
        // this.WxLogin();
      }
    },
    //账号密码登录
    accountLoginHandle() {
      //验证账号密码
      if (this.accountForm.account === "" || this.accountForm.password === "") {
        this.$message({
          type: "error",
          message: "账号或者密码不能为空"
        });
        return false;
      } else {
        //如果本地有token，则先清除token再登录
        if (localStorage.token) {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
        }
        //请求登录参数
        let params = {
          account: this.accountForm.account, //账号
          password: this.accountForm.password, //密码
          ssxt: this.SSXT, //系统名称
          type: 2 //1为管理员   2为会员
        };
        this.successFunc(params, this.accountLoadingBtn); //执行验证通过函数
      }
    },
    //验证通过函数
    successFunc(params, loadingBtn) {
      loadingBtn = true; //账号登录按钮loading
      //请求登录接口
      this.$api.SCREEN.login(params)
        .then(res => {
          if (res.data.retcode === this.SUCCESS_CODE) {
            const token = res.data.data.phSessionToken; //获取token
            localStorage.setItem("token", token); //把token存储到localStorage
            let params = {
              phSessionToken: token
            };
            this.$api.SCREEN.queryUserInfo(params)
              .then(res => {
                if (res.data.retcode === this.SUCCESS_CODE) {
                  loadingBtn = false; //账号登录按钮loading
                  let data = res.data.data;
                  //存在localStorage
                  localStorage.setItem("userInfo", JSON.stringify(data));
                  let url = localStorage.getItem("fullPathUrl");
                  let path = url !== null ? url : "/screen-info/auctionIndex";
                  //跳转到判断的路由
                  this.$router.push(path);
                  if (url !== null) localStorage.removeItem("fullPathUrl");
                  // 记住账号密码时 登录成功时候保存在本地
                  if (this.accORpass) {
                    localStorage.setItem("account", JSON.stringify(this.accountForm.account));
                    localStorage.setItem("password", JSON.stringify(this.accountForm.password));
                    localStorage.setItem("accORpass", JSON.stringify(this.accORpass));
                  } else {
                    localStorage.removeItem("account");
                    localStorage.removeItem("password");
                    localStorage.removeItem("accORpass");
                  }
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else if (res.data.retcode === 201) {
            this.accountLoadingBtn = false;
            this.$message({
              type: "error",
              message: res.data.retmsg
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.retmsg
            });
            this.loadingBtn = false; //账号登录按钮loading
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "请求出错"
          });
          this.loadingBtn = false; //账号登录按钮loadings
        });
    }
  }
};
</script>
<style lang="less">
// 去除谷歌浏览器默认记住密码的填充样式
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  border: 1px solid #ccc !important;
}
.login {
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      height: 12px;
      left: 7px;
    }
  }
  .el-checkbox__label {
    line-height: 20px;
    font-size: 17px;
  }
  .tap-nav {
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tabs__header {
      margin-left: 37px;
    }
    .el-tabs__item {
      padding: 0;
      font-size: 24px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    .el-tabs--top .el-tabs__item.is-top:last-child {
      padding-left: 99px;
    }
    .el-tabs__item.is-active {
      color: rgba(171, 93, 1, 1);
    }
    .el-input__inner {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      padding-left: 58px;
    }
  }
}
</style>
<style lang="less" scoped>
.login {
  .login-left {
    height: 100vh;
    background: url("../../assets/images/banner.png") center center no-repeat;
    background-size: 100%;
  }
  .login-right {
    position: relative;
    height: 100vh;
    background-color: #ededed;
    .logo-bac-r {
      position: absolute;
      right: 0;
      top: 0;
      width: 258px;
      height: 305px;
    }
    .mar-t-170 {
      margin-top: 170px;
    }
    .pad-t-65 {
      padding-top: 65px;
    }
    .pad-t-49 {
      padding-top: 49px;
    }
    .pad-t-51 {
      padding-top: 51px;
    }
    .logo {
      width: 167px;
      height: 48px;
      background: url("../../assets/images/logox1.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .title {
      font-size: 26px;
      font-weight: bold;
      color: rgba(171, 93, 1, 1);
      line-height: 60px;
      padding-left: 19px;
      vertical-align: text-bottom;
    }
    .tap-nav {
      .icon-img {
        img {
          padding: 12px 14px 14px 15px;
        }
      }
      .register {
        width: 100%;
        padding: 17px 0;
        font-size: 24px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
        letter-spacing: 6px;
      }
      .form-item {
        position: relative;
        .forgotPassword {
          position: absolute;
          right: 0;
          top: 50%;
          width: 80px;
          height: 50px;
          color: #ab5d01;
          outline: none;
        }
      }
      .scan-code {
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        color: rgba(119, 119, 119, 1);
      }
    }
  }
}
</style>
